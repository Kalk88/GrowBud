import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../constants'

firebase.initializeApp(firebaseConfig);
export interface Credential {
  email: string,
  password: string
}
interface firebaseError {
  code: string,
  message: string
}

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
    throw (new Error('Authentication error'))
  }
  return new Promise((resolve, _) => resolve(''))
}

export async function registerCredentials(credential: Credential): Promise<string> {
  try {
    const result = await firebase.auth().createUserWithEmailAndPassword(credential.email, credential.password)
    if (result.user) {
      return result.user.getIdToken(true)
    }
  } catch (error) {
    console.error('Unable to register credentials: ', formatError(error))
    throw (new Error('Authentication error'))
  }
  return new Promise((resolve, _) => resolve(''))
}

function formatError(error: firebaseError): string {
  return `code: ${error.code} msg: ${error.message}`
}
