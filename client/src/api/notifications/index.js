import * as firebase from "firebase/app";
import "firebase/messaging"
import gql from 'graphql-tag';
import store from '../../store'

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
//eslint-disable-nextline
messaging.getToken().then(token =>
    postDeviceToken(navigator.userAgent, token)
)

messaging.onMessage((payload) => {
    console.log("Push notification received: ", payload)//eslint-disable-line
})

/**
 *  Posts a device token to the backend.
 * @param {string} deviceName
 * @param {string} deviceToken
 */
function postDeviceToken(deviceName, deviceToken) {
    const upsertDeviceToken = gql`
        mutation upsertDeviceToken($name: String, $token: String)
        upsertDeviceToken(deviceName: $name, deviceToken: $token) {
        status
    }
    `
    fetch(process.env.VUE_APP_API_BASE_URL + '/graph', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${store.state.inMemoryToken.JWT}`
        },
        body: JSON.stringify({
          upsertDeviceToken,
          variables: { deviceName, deviceToken },
        }),
      })
        .then(r => r.json())
        .then(data => console.log('data returned:', data)); //eslint-disable-line
}