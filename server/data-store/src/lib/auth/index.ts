import firebase from '../firebaseClient'
import axios from 'axios'
import qs from 'qs'

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

export interface RefreshInfo {
  JWT: string,
  JWTExpiry: number,
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

export async function refreshToken(token: string): Promise<RefreshInfo> {
  try {
    const payload = {
      grant_type: 'refresh_token',
      refresh_token: token
    }
    const response: any = await axios({
      method: "POST",
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: qs.stringify(payload),
      url: `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASEAPIKEY}`,
    })

    const data = response.data
    return {
      JWT: data.id_token,
      JWTExpiry: Date.now() + data.expires_in,
      refreshToken: data.refresh_token
    }
  } catch (error) {
    console.error(error)
    throw (new Error('Authentication error'))

  }
}

async function userDTO(user: firebase.User): Promise<userInfo> {
  const { token, expirationTime } = await user.getIdTokenResult()
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
