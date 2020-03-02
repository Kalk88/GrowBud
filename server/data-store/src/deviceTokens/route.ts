import  express from 'express'
import {
    parseTokenFromHeaders,
    parseUserIdFromToken
} from '../lib/http'
import { verifyAndDecodeToken } from '../lib/auth'
import * as log from '../logging'
import {
  insertDeviceToken,
  removeDeviceToken
} from '../lib/pushNotificationToken'
import {
  badRequestResponse,
  createdResponse,
  noContentResponse
} from '../../express-helpers'

const router = express.Router()
const removeTokenError = badRequestResponse({error: 'Token de-registration error'})

router.use((req, res, next) => {
  parseTokenFromHeaders(req)
    .then(verifyAndDecodeToken)
    .then(parseUserIdFromToken)
    .then(userId => res.locals.userId = userId)
    .catch(error => log.error(error))
    .finally(() => next())
})


router.post('/', (req, res) => {
  const {deviceToken, deviceName } = req.body
  const userId = res.locals.userId
  log.info('Registering device token for user: ', userId)
  return insertDeviceToken(userId, deviceToken, deviceName, `${Date.now()}`)
    .then(status=> createdResponse(status)(res))
    .catch(error =>{
      log.error(error)
       badRequestResponse({error: 'Token registration error'})(res)
    })
})

router.delete('/:token', (req, res) => {
  const deviceToken = req.params.token
  const userId = res.locals.userId
    log.info('removing device token for user', userId)
    return removeDeviceToken(userId, deviceToken)
    .then(status => {
      if(status === true) {
        return noContentResponse(res)
      }
      return removeTokenError(res)
    })
    .catch(error => {
        log.error(error)
        removeTokenError(res)
    })
})


export default router