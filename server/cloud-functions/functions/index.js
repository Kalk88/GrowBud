const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const messaging = admin.messaging()
const firestore = admin.firestore()

exports.notifySchedulesInRange = functions.region('europe-west1').https.onRequest((req, res) => {
  retrieveSchedules(`${Date.now()}`)
    .then(snapshot => {
      console.log('docs', JSON.stringify(snapshot.docs))
      return snapshot.docs
        .map(doc => ({
          id: doc.id,
          schedule: doc.data()
        }))
        .reduce(reduceSchedulesOnUserId, {})
    })
    .then(doc => {
      console.log('then doc', JSON.stringify(doc))
      Object.entries(doc).map(([userId, v]) => {
        retrieveDeviceTokens(userId)
          .then(tokens => {
            console.log('tokens', JSON.stringify(tokens.data()))
            console.log('V', JSON.stringify(v))
            return messaging.sendAll(
              [tokens.data()].map(d => formatMessage(v, d.deviceToken))
            )
              .then(() => {
                const batch = firestore.batch()
                v.forEach(schedule => {
                  const ref = firestore.collection('wateringSchedules').doc(schedule.docId)
                  batch.set(ref, { nextTimeToWater: schedule.nextTimeToWater + 60 * 60 * 24 * schedule.interval })
                })
                return batch.commit().then(console.log).catch(console.log)
              })
              .catch(err => {
                console.log(
                  {
                    error: 'push notification error',
                    message: err.message
                  })
              })
          })
      })
    })
    .then(it => { console.log(JSON.stringify(it)) })
    .then(res.status(200).send('finished'))
    .catch(err => console.log(err.message))
})

const formatMessage = (doc, token) => {
  console.log(JSON.stringify(doc))
  return {
    token,
    notification: {
      title: 'Time to water!',
      body: `${doc.map(item => item.plants.map(plant => plant.name).join(', '))} needs watering.`
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
  console.log('current', JSON.stringify(current))
  if (accumulator[current.schedule.userId]) {
    accumulator[current.schedule.userId].push(current)
    return accumulator
  }
  return {
    ...accumulator,
    [current.schedule.userId]: [current]
  }
}

exports.reduceSchedulesOnUserId = reduceSchedulesOnUserId
