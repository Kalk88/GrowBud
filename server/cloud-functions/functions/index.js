const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const messaging = admin.messaging()
const firestore = admin.firestore()
const wateringSchedules = firestore.collection('wateringSchedules')
const pushNotifications = firestore.collection('pushNotifications')
const { retrieveDeviceTokens, retrieveSchedulesEarlierThan, setSchedule, setTokensToUser, reduceSchedulesOnUserId } = require('./helpers')

exports.notifySchedulesInRange = functions.region('europe-west1').https.onRequest((req, res) => {
  doWork()
    .then(result => res.status(200).send(result))
    .catch(error => {
      console.log(JSON.stringify(error))
      res.sendStatus(500)
    })
})
const doWork = () => {
  return retrieveSchedulesEarlierThan(wateringSchedules)(`${Date.now()}`)
    .then(snapshot => {
      console.log(`Found ${snapshot.docs.length} schedules to update`)
      return snapshot.docs
        .map(doc => ({
          id: doc.id,
          schedule: doc.data()
        }))
        .reduce(reduceSchedulesOnUserId, {})
    })
    .then(reduced => {
      return Promise.all(Object.entries(reduced).map(([userId, data]) => {
        const addToUserData = setTokensToUser(userId)(data)
        return retrieveDeviceTokens(pushNotifications)(userId)
          .then(devices => devices.map(addToUserData))
          .catch(error => console.log(JSON.stringify(error)))
      }))
    })
    .then(data => {
      return Promise.all(data.map(obj => {
        const messages = Object.entries(obj)
          .map(
            ([k, v]) => v.tokens.map(
              devices => devices.map(
                d => formatMessage(v.schedules, d.deviceToken))
            ))[0]
        if (messages.length > 0) {
          return messaging.sendAll(messages)
            .catch(err => console.log(JSON.stringify(err)))
        }
      })).then(() => data).finally(() => data)
    })
    .then(v => {
      return Promise.all(v.map(schedule => {
        return Object.entries(schedule).map(([k, x]) => {
          return x.schedules.map(s => {
            const toSave = s.schedule
            toSave.nextTimeToWater = (parseInt(s.schedule.nextTimeToWater) + (84600000 * s.schedule.interval)).toString()
            return setSchedule(pushNotifications)(s.id)(toSave)
          })
        })
      }))
    }).then(status => status).finally(status => status)
}

const formatMessage = (doc, token) => {
  return {
    token,
    notification: {
      title: 'Time to water!',
      body: `${doc.map(item => item.schedule.plants.map(plant => plant.name).join(', '))} needs watering.`
    }
  }
}
