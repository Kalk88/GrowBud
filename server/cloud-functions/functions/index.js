const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const messaging = admin.messaging()
const firestore = admin.firestore()
const wateringSchedules = firestore.collection('wateringSchedules')
const pushNotifications = firestore.collection('pushNotifications')

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
          .then(addToUserData)
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

const retrieveSchedulesEarlierThan = collection => time => collection.where('nextTimeToWater', '<', time).get()
const retrieveDeviceTokens = collection => userId => collection.doc(userId).get()
const setSchedule = collection => scheduleId => schedule => collection.doc(scheduleId).set(schedule)
const setTokensToUser = userId => data => tokens => {
  if (tokens.exists) {
    return {
      [userId]: {
        ...data,
        tokens: [tokens.data()]
      }
    }
  }
  return {
    [userId]: {
      ...data,
      tokens: []
    }
  }
}

const reduceSchedulesOnUserId = (accumulator, current) => {
  if (accumulator[current.schedule.userId]) {
    accumulator[current.schedule.userId].schedules.push(current)
    return accumulator
  }
  return {
    ...accumulator,
    [current.schedule.userId]: {
      schedules: [current]
    }
  }
}

exports.reduceSchedulesOnUserId = reduceSchedulesOnUserId
