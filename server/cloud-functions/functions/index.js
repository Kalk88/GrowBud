const functions = require('firebase-functions')
const admin = require('firebase-admin')
const {
  retrieveDeviceTokens,
  retrieveSchedulesEarlierThan,
  setSchedule,
  setTokensToUser,
  setNextTimeToWater
} = require('./helpers')

admin.initializeApp()
const messaging = admin.messaging()
const firestore = admin.firestore()
const wateringSchedulesCollection = firestore.collection('wateringSchedules')
const pushNotificationsCollection = firestore.collection('pushNotifications')

exports.notifySchedulesInRange = functions.region('europe-west1').https.onRequest((req, res) => {
  doWork(wateringSchedulesCollection, pushNotificationsCollection)
    .then(result => res.status(200).send(result))
    .catch(error => {
      logJSON('error')(error)
      res.sendStatus(500)
    })
})
const doWork = (wateringSchedules, pushNotifications) => {
  return retrieveSchedulesEarlierThan(wateringSchedules)(`${Date.now()}`)
    .then(schedules => {
      logJSON('schedules')(schedules)
      return Promise.all(Object.entries(schedules).map(([userId, data]) =>
        retrieveDeviceTokens(pushNotifications)(userId).then(logJSON('tokens'))
          .then(devices => devices.map(setTokensToUser(userId)(data)))
          .catch(error => console.log(JSON.stringify(error)))
      ))
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
            return setSchedule(pushNotifications)(s.id)(setNextTimeToWater(s.schedule))
          })
        })
      }))
    }).then(status => status).finally(status => status)
}

const logJSON = what => thing => console.log(what, JSON.stringify(thing))

const formatMessage = (doc, token) => {
  return {
    token,
    notification: {
      title: 'Time to water!',
      body: `${doc.map(item => item.schedule.plants.map(plant => plant.name).join(', '))} needs watering.`
    }
  }
}

exports.doWork = doWork
