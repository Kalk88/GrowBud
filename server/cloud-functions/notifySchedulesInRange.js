const Firestore = require('@google-cloud/firestore')
const { PubSub } = require('@google-cloud/pubsub');
const firestore = new Firestore({
    projectId: 'growbud-50ed4'
})
const pubsub = new PubSub();
<<<<<<< HEAD
=======
const topicName = 'wateringSchedules'
>>>>>>> Add function finding schedules and passing messages

/**
 * Finds all schedules in range of a set time period and passes messages to be sent to pubsub
 */
<<<<<<< HEAD
exports.notifySchedulesInRange = (req, res) => {
    firestore.collection('wateringSchedules')
        .where('timestamp', '>=', req.body.start)
        .where('timestamp', '<=', req.body.end)
        .get()
        .then(snapshot => {
            snapshot.docs
                .map(doc => formatMessage(doc))
                .then(Buffer.from)
                .then(messageBuffer => pubsub.topic('wateringSchedules').publish(messageBuffer))
                .then(messageId => console.log(`Message ${messageId} published`))
                .then(res.sendStatus(200))
        })
        .catch(error => {
            console.log('Error sending message:', error)
            res.sendStatus(500)
        })
=======
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
>>>>>>> Add function finding schedules and passing messages
}

function formatMessage(doc) {
    //TODO compose message
    return {
        ...doc
    }
}