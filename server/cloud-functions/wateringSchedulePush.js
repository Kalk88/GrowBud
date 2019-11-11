const admin = require('firebase-admin')
const app = admin.initializeApp()

/**
 * Expects messages to be an array and each entry to conform to the FCM message spec.
 */
exports.pushWateringScheduleNotice = functions.pubsub.topic('wateringSchedules').onPublish(async (message) => {
    const wateringNotices = message.json

    try {
        const response = await app.messaging().sendAll(wateringNotices)
        console.log('Successfully sent message:', response)

    } catch (error) {
        console.log('Error sending message:', error)
    }
})