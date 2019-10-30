import * as firebase from "firebase/app";
import "firebase/auth";

export interface Credential {
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

export async function login(credential: Credential): Promise<string> {
  try {
    const result = await firebase.auth().signInWithEmailAndPassword(credential.email, credential.password)
    if (result.user) {
      const token = await result.user.getIdToken(true)
      console.log(token)
      return token
    }
  } catch (error) {
    console.error('Unable to authorize user: ', formatError(error))
  }
  return new Promise((resolve, _) => resolve(''))
}

export async function logout() {
  try {
    //TODO: Something other than sign out
    await firebase.auth().signOut()
  } catch (error) {
    console.error('Unable to sign out user: ', formatError(error))
  }
}

export async function registerCredentials(credential: Credential) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(credential.email, credential.password)
  } catch (error) {
    console.error('Unable to register credentials: ', formatError(error))

  }
}

function formatError(error: firebaseError): string {
  return `code: ${error.code} msg: ${error.message}`
}
