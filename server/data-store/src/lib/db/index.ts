import firebase from '../firebaseClient';
const db = firebase.firestore()

export async function getWateringSchedulesInRangeOf(start: string, end: string): Promise<Array<object>> {
    let schedulesRef = db.collection('wateringSchedules')
    try {
        const snapshot = await schedulesRef
            .where('timestamp', '>=', start)
            .where('timestamp', '<=', end)
            .get()
        const data: Array<object> = snapshot
            .docs
            .map(doc => {
                const item = doc.data()
                item.id = doc.id
                return item
            })
        return data
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
        const data: Array<object> = snapshot
            .docs
            .map(doc => {
                const item = doc.data()
                item.id = doc.id
                return item
            })
        console.log(data)
        return data
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
            const item = doc.data()
            if (item) {
                item.id = doc.id
                return item
            }
        }
        return {}
    } catch (error) {
        console.error(error.message)
        throw new Error("Database error")
    }
}