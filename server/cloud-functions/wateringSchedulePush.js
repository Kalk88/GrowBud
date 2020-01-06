const admin = require('firebase-admin')
const app = admin.initializeApp()
const messaging = app.messaging()

/**
 * Expects messages to be an array and each entry to conform to the FCM message spec.
 */
exports.pushWateringScheduleNotice = (pubSubEvent, context) => {
    [pubSubEvent.data]
        .map(msg => Buffer.from(msg, 'base64'))
        .map(JSON.parse)
        .map(toString)
        .map(messaging.sendAll)
        .then(console.log)
        .catch(error => console.error(error))
}