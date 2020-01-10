import { db } from '../firebaseClient'
import uuidv4 from 'uuid/v4'
import * as R from 'ramda'
import Maybe from 'folktale/maybe'

export interface WateringSchedule {
    id: string,
    plants: Array<object>,
    nextTimeToWater: string,
    interval: number
}

export async function getWateringSchedulesForUser(userId: string, offsetDoc: string, limit: number): Promise<Array<WateringSchedule>> {
    let snapshot: any
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

export async function scheduleWateringFor(plants: Array<object>, userId: string, timestamp: string, interval: number): Promise<WateringSchedule> {
    const uuid: string = uuidv4()
    const schedule = {
        userId,
        plants,
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

export async function updateWateringSchedule(scheduleId: string, plants: Array<object>, userId: string, timestamp: string, interval: number): Promise<WateringSchedule> {
    const schedule = {
        userId,
        plants,
        nextTimeToWater: timestamp,
        interval
    }

    await db.collection('wateringSchedules')
        .doc(scheduleId)
        .set(schedule, { merge: true })
    return {
        id: scheduleId,
        ...schedule
    }
}

export async function removeWateringScheduleById(id: string): Promise<object> {
    try {
        await db.collection('wateringSchedules')
            .doc(id)
            .delete()
    } catch (error) {
        console.error(error)
        return { status: false }
    }
    return { status: true }
}

function snapshotToSchedule(doc: FirebaseFirestore.DocumentSnapshot): WateringSchedule {
    return Maybe.Just(doc.data()).matchWith({
        Just: (x: any) => ({
            id: doc.id,
            ...x.value
        }),
        Nothing: () => { }
    })
}