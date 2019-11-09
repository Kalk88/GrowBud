import firebase from '../firebaseClient'
import uuidv4 from 'uuid/v4'
const db = firebase.firestore()
import * as R from 'ramda'
import Maybe from 'folktale/maybe'

export async function getWateringSchedulesForUser(userId: string, offset: number, limit: number): Promise<Array<object>> {
    const schedulesRef = db.collection('wateringSchedules')
    const snapshot = await schedulesRef
        .where('userId', '==', userId)
        .orderBy('desc')
        .startAt(offset)
        .limit(limit)
        .get()

    return R.map(snapshotToSchedule, snapshot.docs)
}

export async function getWateringScheduleById(id: string): Promise<object> {
    const schedulesRef = db.collection('wateringSchedules')
    const doc = await schedulesRef
        .doc(id)
        .get()
    return snapshotToSchedule(doc)
}

export async function scheduleWateringFor(plant: object, userId: string, timestamp: string): Promise<object> {
    const uuid: string = uuidv4()
    const schedule = {
        userId,
        plant,
        nextTimeToWater: timestamp
    }

    await db.collection('wateringSchedules')
        .doc(uuid)
        .set(schedule)
    return {
        id: uuid,
        ...schedule
    }
}

function snapshotToSchedule(doc: firebase.firestore.QueryDocumentSnapshot | firebase.firestore.DocumentSnapshot): object {
    return Maybe.Just(doc.data()).matchWith({
        Just: (x: any) => ({
            id: doc.id,
            ...x.value
        }),
        Nothing: () => { }
    })
}