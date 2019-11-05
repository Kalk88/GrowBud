import firebase from '../firebaseClient';
const db = firebase.firestore()

export async function getWateringSchedulesInRangeOf(start: string, end: string): Promise<Array<object>> {
    let schedulesRef = db.collection('wateringSchedules')
    try {
        const snapshot = await schedulesRef
            .where('timestamp', '>=', start)
            .where('timestamp', '<=', end)
            .get()

        return snapshot
            .docs
            .map(doc => snapshotToSchedule(doc))
    } catch (error) {
        console.error(error.message)
        throw new Error("Database error")
    }
}

export async function getWateringSchedulesForUser(userId: string, offset: number, limit: number): Promise<Array<object>> {
    let schedulesRef = db.collection('wateringSchedules')
    try {
        const snapshot = await schedulesRef
            .where('userId', '==', userId)
            .orderBy('desc')
            .startAt(offset)
            .limit(limit)
            .get()
        return snapshot
            .docs
            .map(doc => snapshotToSchedule(doc))
    } catch (error) {
        console.error(error.message)
        throw new Error("Database error")
    }
}

export async function getWateringScheduleById(id: string): Promise<object> {
    let schedulesRef = db.collection('wateringSchedules')
    try {
        const doc = await schedulesRef
            .doc(id)
            .get()
        if (doc.exists) {
            return snapshotToSchedule(doc)
        }
        return {}
    } catch (error) {
        console.error(error.message)
        throw new Error("Database error")
    }
}

function snapshotToSchedule(doc: firebase.firestore.QueryDocumentSnapshot | firebase.firestore.DocumentSnapshot): object {
    const item = doc.data()
    if (item === undefined) {
        throw new Error("Database error")
    }
    item.id = doc.id
    return item
}