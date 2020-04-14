import * as admin from 'firebase-admin'
//export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json" for local dev
// On app engine GCP will supply the credentials
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://growbud-50ed4.firebaseio.com"
}, 'datastore')
const db = admin.firestore()

export {
    admin,
    db
}