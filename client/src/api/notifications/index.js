import * as firebase from "firebase/app";
import "firebase/messaging"
import axios from 'axios'

const firebaseConfig = {
    apiKey: process.env.VUE_APP_FIREBASE_APIKEY,
    authDomain: process.env.VUE_APP_FIREBASE_AUTHDOMAIN,
    databaseURL: process.env.VUE_APP_FIREBASE_DATABASEURL,
    projectId: process.env.VUE_APP_FIREBASE_PROJECTID,
    storageBucket: process.env.VUE_APP_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.VUE_APP_FIREBASE_APPID,
    measurementId: process.env.VUE_APP_FIREBASE_MEASEUREMENTID
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();
// Add the public key generated from the console here.
messaging.usePublicVapidKey(process.env.VUE_APP_FIREBASE_PUBLICVAPIDKEY);

// Callback fired if Instance ID token is updated.
//eslint-disable-nextline
messaging.onTokenRefresh(() => {
    messaging.getToken()
        .then(token => postDeviceToken(navigator.appName, token))
        .catch(error => console.log(error));
});

messaging.onMessage((payload) => {
    console.log("Push notification received: ", payload)//eslint-disable-line
})

/**
 * Retrieve a FCM token and register it with the backend for the user
 * with the given credentials.
 * @param {*} credentials
 */
export function upsertPushTokenOnLogin() {
    //eslint-disable-nextline
    return messaging.getToken()
        .then(token => postDeviceToken(navigator.appName, token))
        .catch(error => console.log(error)); //eslint-disable-line
}

export function deleteTokenOnLogout() {
    messaging.getToken()
    .then(token => messaging.deleteToken(token)
        .catch(error => console.log(error))//eslint-disable-line
    )
    .catch(error => console.log(error));//eslint-disable-line
}

/**
 *  Posts a device token to the backend.
 * @param {string} deviceName
 * @param {string} deviceToken token from firebase
 */
function postDeviceToken(deviceName, deviceToken) {
    return axios({
        url: `${process.env.VUE_APP_API_BASE_URL}/api/deviceTokens`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
          authorization: `Bearer ${store.state.inMemoryToken.JWT}`,
        },
        withCredentials:true,
        data: {
            deviceName,
            deviceToken
            }
      })
        .catch(error => console.log(error)); //eslint-disable-line
}
