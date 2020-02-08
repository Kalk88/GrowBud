import { db, admin } from '../firebaseClient'

export interface PushNotificationToken {
    deviceToken: string
    deviceName: string
    createdAt: string
}

const COLLECTION = 'pushNotifications'

export function upsertDeviceToken(userId: string, deviceToken: string, deviceName: string, createdAt: string): Promise<PushNotificationToken | Error> {
    const data = {
                deviceName,
                deviceToken,
                createdAt
            }

    return db.collection(COLLECTION)
        .doc(userId)
        .update({devices: admin.firestore.FieldValue.arrayUnion(data)})
        .then(_ => data)
        .catch(() => {
            return db.collection(COLLECTION)
            .doc(userId)
            .set({devices: [data]})
            .then(_ => data)
                .catch(error =>{
                    console.log(error)
                    return new Error()
                })
        })
}