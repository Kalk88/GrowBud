require('dotenv').config()
import express from 'express'
import graphQLHTTP from 'express-graphql'
import schema from './schema'
import { refreshToken as rf, RefreshInfo} from './lib/auth'
import cookieParser from 'cookie-parser'
import * as log from './logging'
import { deviceTokensRoutes } from './deviceTokens'
const app = express()
const port = process.env.PORT ? process.env.PORT : 9090
const whitelist = process.env.WHITELIST ? process.env.WHITELIST.split(',') : []

app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
  whitelist.forEach(host => {
    if (req.headers.origin === host) res.header('Access-Control-Allow-Origin', req.headers.origin)
  })
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET, POST')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

app.use((req, _res, next) => {
  log.debug('Incoming request: ', `
    ip: ${req.ip}
    path: ${req.path}
    method: ${req.method}
    body: ${JSON.stringify(req.body)}
  `)
  next()
})

app.get('/', (_req, res) => {
  res.send('Hello world!')
})

app.post('/api/refreshToken', async (req, res) => {
  const token = req?.cookies?.refreshToken
  if (token === null || token === undefined) {
    log.debug('Invalid token')
    res.status(400).send({ error: 'missing payload' })
  } else {
    const { JWT, JWTExpiry, refreshToken }: RefreshInfo = await rf(token)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true
    })
    log.debug('Refreshed token')
    res.status(200).send({ JWT, JWTExpiry })
  }
})

app.use('api/deviceTokens', deviceTokensRoutes)

if (process.env.NODE_ENV === 'development') {
  app.use('/graph/view', graphQLHTTP({
    schema,
    graphiql: true
  }))
}

app.post('/graph', graphQLHTTP({
  schema
}))

app.get('/graph', graphQLHTTP({
  schema
}))

app.use((err: any, _req: any, res: any, _next: any) => {
  log.error(err.stack)
  res.status(500).send('Something broke!')
})

// start the Express server
app.listen(port, () => {
  log.info(`server started.`)
})
