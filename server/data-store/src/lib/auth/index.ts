import { admin } from '../firebaseClient'
import * as log from '../../logging'
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

export function login(credential: Credential): Promise<userInfo> {
  return axios({
    method: "POST",
    headers: { 'content-type': 'application/json' },
    data: {
      email: credential.email,
      password: credential.password,
      returnSecureToken: true
    },
    url: `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASEAPIKEY}`,
  })
    .then(response => response.data)
    .then(data => {
      return {
        id: data.localId,
        JWT: data.idToken,
        JWTExpiry: expiresToMilliseconds(data.expiresIn),
        refreshToken: data.refreshToken
      }
    }).catch(error => {
      console.error('Unable to authorize user: ', error.toJSON())
      throw (new Error('Authentication error'))
    })
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

export function verifyAndDecodeToken(token: string): Promise<object> {
  return admin.auth().verifyIdToken(token)
  .then(res => res)
  .catch(error => {
    log.error(error)
     throw new Error('invalid token')
    })
}

export function refreshToken(token: string): Promise<RefreshInfo> {
  return axios({
    method: "POST",
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(
      {
        grant_type: 'refresh_token',
        refresh_token: token
      }
    ),
    url: `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASEAPIKEY}`,
  })
    .then(response => response.data)
    .then(data => {
      return {
        JWT: data.id_token,
        JWTExpiry: expiresToMilliseconds(data.expires_in),
        refreshToken: data.refresh_token
      }
    }).catch(error => {
      console.error('Unable to refresh token', error.message)
      throw (new Error('Authentication error'))
    })
}

const expiresToMilliseconds = expires => Date.now() + (expires * 1000)