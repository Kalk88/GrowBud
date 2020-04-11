const functions = require('firebase-functions')
const admin = require('firebase-admin')
const notifications = require('../../notifications/lib/index')
const dataStore = require('../../data-store/dist/src/index')

admin.initializeApp()
const firestore = admin.firestore()
const wateringSchedulesCollection = firestore.collection('wateringSchedules')
const pushNotificationsCollection = firestore.collection('pushNotifications')
const region = 'europe-west1'
const NOTIFICATIONS_TOPIC = 'send-push-notifications'
const logJSON = message => obj => console.log(message, JSON.stringify(obj))

exports.notifySchedulesInRange = functions.region(region).https.onRequest((req, res) => {
  return notifications.notifySchedulesInRange(wateringSchedulesCollection, NOTIFICATIONS_TOPIC)
    .then((status) => {
      logJSON('Successful update of schedules')(status)
      res.status(200).send(status)
    })
    .catch((error) => {
      logJSON('Error: ')(error)
      res.status(500).send({ error: 'Something broke' })
    })
})

exports.pushNotifications = functions.region(region).pubsub.topic(NOTIFICATIONS_TOPIC).onPublish((message) => {
  return notifications.pushNotifications(pushNotificationsCollection, message)
})

exports.dataStore = functions.region(region).https.onRequest(dataStore.app)
