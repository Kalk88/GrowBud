import * as firebase from "firebase/app";
import "firebase/auth";

interface Credential {
  email: string,
  password: string
}

interface firebaseError {
  code: string,
  message: string
}

const firebaseConfig = {
  apiKey: "AIzaSyAOVXtaV1OsZp3YWwH_d3fiL2pdbGUuQH8",
  authDomain: "growbud-50ed4.firebaseapp.com",
  databaseURL: "https://growbud-50ed4.firebaseio.com",
  projectId: "growbud-50ed4",
  storageBucket: "growbud-50ed4.appspot.com",
  messagingSenderId: "1032847847071",
  appId: "1:1032847847071:web:116560c04ed237deb9bcaa",
  measurementId: "G-N5LWZZRVS4"
}

firebase.initializeApp(firebaseConfig);

async function login(credential: Credential) {
  try {
    const result = await firebase.auth().signInWithEmailAndPassword(credential.email, credential.password)
  } catch (error) {
    console.error('Unable to authorize user: ', formatError(error))
  }
}

async function logout() {
  try {
    await firebase.auth().signOut()
  } catch (error) {
    console.error('Unable to sign out user: ', formatError(error))
  }
}

async function registerCredentials(credential: Credential) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(credential.email, credential.password)
  } catch (error) {
    console.error('Unable to register credentials: ', formatError(error))

  }
}

function formatError(error: firebaseError): string {
  return `code: ${error.code} msg: ${error.message}`
}

module.exports = {
  login,
  logout,
  registerCredentials,
  Credential
}
