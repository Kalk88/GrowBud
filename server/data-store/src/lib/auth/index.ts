import { admin } from '../firebaseClient'
import axios from 'axios'
import qs from 'qs'
import uuidv4 from 'uuid/v4'
export interface Credential {
  email: string,
  password: string
}
export interface userInfo {
  JWT: string,
  JWTExpiry: number,
  id: string,
  refreshToken: string
}

export interface RefreshInfo {
  JWT: string,
  JWTExpiry: number,
  refreshToken: string
}

export type userID = string

export async function login(credential: Credential): Promise<userInfo> {
  try {
    const { email, password } = credential
    const payload = {
      email,
      password,
      returnSecureToken: true
    }
    const response: any = await axios({
      method: "POST",
      headers: { 'content-type': 'application/json' },
      data: payload,
      url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASEAPIKEY}`,
    })

    const { localId, idToken, expiresIn, refreshToken } = response.data
    // Date.now() is milliseconds, expiresIn is seconds.
    const JWTExpiry = Date.now() + (expiresIn * 1000)
    return {
      id: localId,
      JWT: idToken,
      JWTExpiry,
      refreshToken: refreshToken
    }

  } catch (error) {
    console.error('Unable to authorize user: ', error.toJSON())
    throw (new Error('Authentication error'))
  }
}

export async function registerUser(credential: Credential, userName: string): Promise<boolean> {
  try {
    const uid = uuidv4()
    await admin.auth().createUser({
      uid,
      displayName: userName,
      email: credential.email,
      emailVerified: false,
      password: credential.password,
      disabled: false
    })
    return true
  } catch (error) {
    console.error('Unable to register credentials: ', error)
    throw (new Error('Authentication error'))
  }
}

export async function removeUser(id: string) {
  try {
    await admin.auth().deleteUser(id)
  } catch (error) {
    console.log('Error deleting user:', error)
    return { status: false }
  }
  return { status: true }
}

export async function parseUserIdFromToken(token: string): Promise<userID> {
  let decodedToken = await admin.auth().verifyIdToken(token)
  return decodedToken.uid
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
    // Date.now() is milliseconds, expires_in is seconds.
    const JWTExpiry = Date.now() + (data.expires_in * 1000)
    return {
      JWT: data.id_token,
      JWTExpiry,
      refreshToken: data.refresh_token
    }
  } catch (error) {
    console.error(error.message)
    throw (new Error('Authentication error'))

  }
}
