const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp()
const messaging = admin.messaging()
const firestore = admin.firestore()

exports.notifySchedulesInRange = functions.region('europe-west1').https.onRequest((req, res) => {
    retrieveSchedules(`${Date.now() - (60 * 60 * 24)}`, `${Date.now() + (60 * 60 * 24)}`)
        .then(snapshot => {
            console.log('docs', snapshot.docs)
            return snapshot.docs
                .map(doc => doc.data())
                .reduce(reduceSchedules, {})
                .map(doc => Object.entries(doc).map((k, v) =>
                    retrieveNotifications(k)
                        .then(tokens => {
                            console.log('tokens', tokens.data())
                            return messaging.sendAll([tokens.data()].map(d => formatMessage(v, d.deviceToken))).then(console.log).catch(console.log)
                        }).catch(err => reject(err))
                ))
        })
        .then(it => { console.log(it) })
        .then(res.status(200).send('finished'))
})
/**
 * Expects messages to be an array and each entry to conform to the FCM message spec.
 */
const formatMessage = (doc, token) => ({
    token,
    notification: {
        title: 'Time to water!',
        body: `${doc.map(item => item.plants.map(plant => plant.name).join(', '))} needs watering.`,
    }
})

const retrieveSchedules = (past, future) => firestore.collection('wateringSchedules')
    .where('nextTimeToWater', '>', past)
    .where('NextTimeToWater', '<', future)
    .get()

const retrieveNotifications = userId => firestore.collection('pushNotifications')
    .doc(userId)
    .get()

const reduceSchedules = (accumulator, current) => {
    if (accumulator.hasOwnProperty(current.userId)) {
        accumulator[current.userId].push(current)
        return accumulator
    }
    return {
        ...accumulator,
        [current.userId]: [current]
    }
}

exports.reduceSchedules = reduceSchedules