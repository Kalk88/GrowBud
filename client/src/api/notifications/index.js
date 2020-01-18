import * as firebase from "firebase/app";
import "firebase/messaging"


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
messaging.getToken().then(token => console.log("permission token: ", token))//eslint-disable-line

messaging.onMessage((payload) => {
    console.log("Push notification recieved: ", payload)//eslint-disable-line
})
