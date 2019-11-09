import * as firebase from "firebase/app";
import "firebase/auth";

export interface Credential {
  email: string,
  password: string
}

export interface userInfo {
  JWT: string,
  id: string
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

export async function login(credential: Credential): Promise<userInfo> {
  try {
    const result = await firebase.auth().signInWithEmailAndPassword(credential.email, credential.password)
    return userDTO(result.user)
  } catch (error) {
    console.error('Unable to authorize user: ', formatError(error))
    throw (new Error('Authentication error'))
  }
}

export async function registerCredentials(credential: Credential): Promise<userInfo> {
  try {
    const result = await firebase.auth().createUserWithEmailAndPassword(credential.email, credential.password)
    return userDTO(result.user)
  } catch (error) {
    console.error('Unable to register credentials: ', formatError(error))
    throw (new Error('Authentication error'))
  }
}

async function userDTO(user: any): Promise<userInfo> {
  const token = await user.getIdToken(true)
  return {
    JWT: token,
    id: user.uid
  }
}

function formatError(error: firebaseError): string {
  return `code: ${error.code} msg: ${error.message}`
}
