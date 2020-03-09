import { db, admin } from '../firebaseClient'
import * as log from '../../logging'


export interface PushNotificationToken {
    deviceToken: string
    deviceName: string
    createdAt: string
}

const COLLECTION = 'pushNotifications'

export function insertDeviceToken(userId: string, deviceToken: string, deviceName: string, createdAt: string): Promise<PushNotificationToken | Error> {
    const data = {
                deviceName,
                deviceToken,
                createdAt
            }

    return db.collection(COLLECTION)
        .doc(userId)
        .set({[deviceToken]: data}, {merge: true})
        .then(_ => data)
            .catch(error =>{
                log.error('Could not insert device token', error)
                return new Error()
        })
}

export function removeDeviceToken(userId: string, deviceToken: string):Promise<boolean> {
    return db.collection(COLLECTION)
        .doc(userId).update({[deviceToken]: admin.firestore.FieldValue.delete()})
        .then(_ => true)
        .catch(error => {
            log.error('Could not remove device token', error)
            return false
        })
}