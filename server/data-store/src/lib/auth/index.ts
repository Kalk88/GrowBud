import firebase from '../firebaseClient';

export interface Credential {
  email: string,
  password: string
}

export interface userInfo {
  JWT: string,
  JWTExpiry: string,
  id: string,
  refreshToken: string
}

interface firebaseError {
  code: string,
  message: string
}


export async function login(credential: Credential): Promise<userInfo> {
  try {
    const result = await firebase.auth().signInWithEmailAndPassword(credential.email, credential.password)
    if (result.user) {
      return userDTO(result.user)
    }
    throw (new Error('Authentication error'))
  } catch (error) {
    console.error('Unable to authorize user: ', formatError(error))
    throw (new Error('Authentication error'))
  }
}

export async function registerCredentials(credential: Credential): Promise<userInfo> {
  try {
    const result = await firebase.auth().createUserWithEmailAndPassword(credential.email, credential.password)
    if (result.user) {
      return userDTO(result.user)
    }
    throw (new Error('Authentication error'))
  } catch (error) {
    console.error('Unable to register credentials: ', formatError(error))
    throw (new Error('Authentication error'))
  }
}

async function userDTO(user: firebase.User): Promise<userInfo> {
  const { token, expirationTime } = await user.getIdTokenResult(true)
  return {
    JWT: token,
    JWTExpiry: expirationTime,
    id: user.uid,
    refreshToken: user.refreshToken
  }
}

function formatError(error: firebaseError): string {
  return `code: ${error.code} msg: ${error.message}`
}
