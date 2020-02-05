const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const messaging = admin.messaging()
const firestore = admin.firestore()
/*
exports.notifySchedulesInRange = functions.region('europe-west1').https.onRequest(async (req, res) => {
  const schedules = await retrieveSchedules(`${Date.now()}`)
  console.log(`Found ${schedules.docs.length} schedules to update`)
  const orderedOnUserId = schedules.docs
    .map(doc => ({
      id: doc.id,
      schedule: doc.data()
    }))
    .reduce(reduceSchedulesOnUserId, {})
  console.log('ordered on userId', JSON.stringify(orderedOnUserId))
  let tokensAndSchedules = []
  /*
  try {
    const res = await Promise.all(Object.keys(orderedOnUserId).map(async k => {
      const tokens = await retrieveDeviceTokens(k)
      console.log('bruv', JSON.stringify(tokens.data()))
      return {
        k: tokens.data()
      }
    }))
    console.log('post bruv', JSON.stringify(res))
  } catch (error) {
    console.log(JSON.stringify(error))
  }
  */
/*
  try {
    tokensAndSchedules = await Promise.all(Object.entries(orderedOnUserId).map(async ([k, v]) => {
      const tokens = await retrieveDeviceTokens(k)
      console.log('tokens', JSON.stringify(tokens.data()))
      if (tokens.exists) {
        return {
          [k]: {
            ...v,
            tokens: [tokens.data()]
          }
        }
      } else {
        return {
          [k]: {
            ...v,
            tokens: []
          }
        }
      }
    }))
  } catch (error) {
    console.log(JSON.stringify(error))
  }
  console.log('post tokens', JSON.stringify(tokensAndSchedules))
  const formated = tokensAndSchedules.map(o => o.tokens.map(t => formatMessage(o.schedule, t.deviceToken)))
  try {
    const res = await messaging.sendAll(formated)
    console.log(JSON.stringify(res))
  } catch (error) {
    console.log(JSON.stringify(error))
  }
  res.status(200).send('finished')
})
*/
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
      console.log('docs per user: ', JSON.stringify(reduced))
      return Promise.all(Object.entries(reduced).map(([userId, data]) => {
        console.log(userId, JSON.stringify(data))
        return retrieveDeviceTokens(userId)
          .then(tokens => {
            console.log('tokens', JSON.stringify(tokens.data()))
            console.log('data', JSON.stringify(data))
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
      console.log('data to send', JSON.stringify(data))
      return Promise.all(data.map(obj => {
        const messages = Object.entries(obj).map(([k, v]) => v.tokens.map(d => formatMessage(v.schedules, d.deviceToken)))[0]
        console.log('messages', JSON.stringify(messages))
        if (messages.length > 0) {
          return messaging.sendAll(messages)
            .catch(err => console.log(JSON.stringify(err)))
        }
      })).then(() => data).finally(() => data)
    })
    .then(v => {
      console.log('batch writing: ', JSON.stringify(v))
      return Promise.all(v.map(schedule => {
        return Object.entries(schedule).map(([k, x]) => {
          console.log('x', JSON.stringify(x))
          return x.schedules.map(s => {
            console.log('s', JSON.stringify(s))
            const toSave = s.schedule
            toSave.nextTimeToWater = (parseInt(s.schedule.nextTimeToWater) + (86400 * s.schedule.interval)).toString()
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
  console.log('formatting', JSON.stringify(doc))
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
