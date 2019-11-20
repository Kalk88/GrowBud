import firebase from '../firebaseClient'
import uuidv4 from 'uuid/v4'
const db = firebase.firestore()
import * as R from 'ramda'
import Maybe from 'folktale/maybe'

export interface WateringSchedule {
    id: string,
    plant: object,
    nextTimeToWater: string,
    interval: number
}

export async function getWateringSchedulesForUser(userId: string, offsetDoc: string, limit: number): Promise<Array<WateringSchedule>> {
    let snapshot: firebase.firestore.QuerySnapshot
    if (offsetDoc) {
        const prevSnapshot = await db.collection('wateringSchedules').doc(offsetDoc).get()
        snapshot = await db.collection('wateringSchedules')
            .where('userId', '==', userId)
            .orderBy('nextTimeToWater', 'desc')
            .startAfter(prevSnapshot)
            .limit(limit)
            .get()
    } else {
        snapshot = await db.collection('wateringSchedules')
            .where('userId', '==', userId)
            .orderBy('nextTimeToWater', 'desc')
            .limit(limit)
            .get()
    }
    return R.map(snapshotToSchedule, snapshot.docs)
}

export async function getWateringScheduleById(id: string): Promise<WateringSchedule> {
    const schedulesRef = db.collection('wateringSchedules')
    const doc = await schedulesRef
        .doc(id)
        .get()
    return snapshotToSchedule(doc)
}

export async function scheduleWateringFor(plant: object, userId: string, timestamp: string, interval: number): Promise<WateringSchedule> {
    const uuid: string = uuidv4()
    const schedule = {
        userId,
        plant,
        nextTimeToWater: timestamp,
        interval
    }

    await db.collection('wateringSchedules')
        .doc(uuid)
        .set(schedule)
    return {
        id: uuid,
        ...schedule
    }
}

function snapshotToSchedule(doc: firebase.firestore.QueryDocumentSnapshot | firebase.firestore.DocumentSnapshot): WateringSchedule {
    return Maybe.Just(doc.data()).matchWith({
        Just: (x: any) => ({
            id: doc.id,
            ...x.value
        }),
        Nothing: () => { }
    })
}