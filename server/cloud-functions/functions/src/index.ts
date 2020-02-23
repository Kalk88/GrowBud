import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

admin.initializeApp()
const firestore = admin.firestore()
const wateringSchedulesCollection = firestore.collection('wateringSchedules')

exports.notifySchedulesInRange = functions.region('europe-west1').https.onRequest((req, res) => {
    retrieveSchedulesEarlierThan(wateringSchedulesCollection)(`${Date.now()}`)
    .then((schedulesByUser: UserSchedules) => {
        logJSON('schedulesByUser')(schedulesByUser)
        if(Object.keys(schedulesByUser).length === 0) {
            return {
                status: "No schedules to update"
            }
        }
        const s: ScheduleDocument[] = Object
            .entries(schedulesByUser)
            .map(
                ([userId, data]: [UserId, {[schedules: string]: ScheduleDocument[]}]) =>
                    data.schedules.map(doc => {
                        doc.schedule = setNextTimeToWater(doc.schedule)
                    return doc
                }))
            .reduce((accumulator, current) => accumulator.concat(current))
        return Promise.all(
            s.map((doc: ScheduleDocument) => setSchedule(wateringSchedulesCollection)(doc.id)(doc.schedule))
        )
    })
    .then((status: any) => {
        logJSON('Successful update of schedules')(status)
        res.status(200).send(status)
    })
    .catch((error: any) => {
        logJSON('Error: ')(error)
        res.status(500).send({error: 'Something broke'})
    })
})

/**
 *  Retrieves watering schedules from firebase.
 * @param {*} collection A firebase collection
 * @param time a javascript timestamp as string
 * @returns {object} map of schedules structured on userId
 */
const retrieveSchedulesEarlierThan = (collection: FirebaseFirestore.CollectionReference): Function => (time: string):Promise<UserSchedules> => collection
  .where('nextTimeToWater', '<', time)
  .get()
  .then(snapshot => {
    console.log(`Found ${snapshot.docs.length} schedules to update`)
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        schedule: doc.data()
      }))
      .reduce(
            (accumulator: any, current: any) => {
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
          , {})
  }).catch(error => {
    logJSON('schedule retrieval error')(error)
    return error
  })

const setSchedule = (collection: FirebaseFirestore.CollectionReference): Function => (scheduleId:string): Function => (scheduleDoc: WateringSchedule) => collection
  .doc(scheduleId)
  .set(scheduleDoc)
  .then(status => {
    return {
        id: scheduleId,
        status: status
    }
  })
  .catch(error => {
    return {
        id: scheduleId,
        status: error
    }
  })
/**
 * Takes an schedule and updates the next time to water with the schedule interval
 * returns a new schedule object.
 */
const setNextTimeToWater = (toUpdate: WateringSchedule): WateringSchedule => ({
    ...toUpdate,
    nextTimeToWater: (parseInt(toUpdate.nextTimeToWater) + (84600000 * toUpdate.interval)).toString()
})

const logJSON = (title: string) => (obj: object) => console.log(title, JSON.stringify(obj))

interface UserSchedules {
    UserId: {
        [schedules: string]: ScheduleDocument[]
    }
}

type ScheduleDocument = {
        id: DocumentId,
        schedule: WateringSchedule
    }
type UserId = string
type DocumentId = string
type WateringSchedule = {
    id: string,
    plants: Array<object>,
    nextTimeToWater: string,
    interval: number,
    userId: string
}