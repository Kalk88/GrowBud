import * as firebase from 'firebase/app'
import 'firebase/firestore';
import firebaseConfig from '../constants'

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

export async function getWateringSchedulesInRangeOf(timestamp: string): Promise<Array<object>> {
    let schedulesRef = db.collection('wateringSchedules')
    try {
        const snapshot = await schedulesRef.get()
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

export async function getWateringSchedulesForUser(userId: string, limit: number): Promise<Array<object>> {
    let schedulesRef = db.collection('wateringSchedules')
    try {
        const snapshot = await schedulesRef.where('userId', '==', userId).limit(limit).get()
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