const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const messaging = admin.messaging()
const firestore = admin.firestore()

exports.notifySchedulesInRange = functions.region('europe-west1').https.onRequest((req, res) => {
  return retrieveSchedules(`${Date.now()}`)
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
        return retrieveDeviceTokens(userId)
          .then(tokens => {
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
          }).catch(error => console.log(JSON.stringify(error)))
      }))
    })
    .then(data => {
      return Promise.all(data.map(obj => {
        const messages = Object.entries(obj).map(([k, v]) => v.tokens.map(d => formatMessage(v.schedules, d.deviceToken)))[0]
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
            return firestore.collection('wateringSchedules').doc(s.id).set(toSave)
          })
        })
      })).then(status => status).finally(status => status)
    })
    .then(status => res.status(200).send(status))
    .catch(err => {
      console.log(JSON.stringify(
        {
          error: 'push notification error',
          message: err.message
        })
      )
    })
})

const formatMessage = (doc, token) => {
  return {
    token,
    notification: {
      title: 'Time to water!',
      body: `${doc.map(item => item.schedule.plants.map(plant => plant.name).join(', '))} needs watering.`
    }
  }
}

const retrieveSchedules = time => firestore.collection('wateringSchedules')
  .where('nextTimeToWater', '<', time)
  .get()

const retrieveDeviceTokens = userId => firestore.collection('pushNotifications')
  .doc(userId)
  .get()

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