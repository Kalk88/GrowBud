const Firestore = require('@google-cloud/firestore')
const { PubSub } = require('@google-cloud/pubsub');
const firestore = new Firestore({
    projectId: 'growbud-50ed4'
})
const pubsub = new PubSub();
const topicName = 'wateringSchedules'

/**
 * Finds all schedules in range of a set time period and passes messages to be sent to pubsub
 */
exports.notifySchedulesInRange = async (req, res) => {
    try {
        const schedulesRef = firestore.collection('wateringSchedules')
        const snapshot = await schedulesRef
            .where('timestamp', '>=', req.body.start)
            .where('timestamp', '<=', req.body.end)
            .get()

        const messages = snapshot.docs.map(doc => formatMessage(doc))
        const messagesBuffer = Buffer.from(messages);
        const messageId = await pubsub.topic(topicName).publish(messagesBuffer)
        console.log(`Message ${messageId} published.`)
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
        console.log('Error sending message:', error)
    }
}

function formatMessage(doc) {
    //TODO compose message
    return {
        ...doc
    }
}