import { db } from '../firebaseClient'

export interface PushNotificationToken {
    devices: Array<{
        deviceToken: string
        deviceName: string
    }>
    createdAt: string
}

export function upsertDeviceToken(userId: string, deviceToken: string, deviceName: string, createdAt: number): Promise<PushNotificationToken> {
    const data = {
        devices: [
            {
                deviceName,
                deviceToken
            }],
        createdAt
    }
    return db.collection('pushNotifications')
        .doc(userId)
        .set(data, { merge: true })
        .then(_ => data)
        .catch(error => error)
}