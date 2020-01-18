require('dotenv').config()
import express from 'express'
import graphQLHTTP from 'express-graphql'
import schema from './schema'
import { refreshToken as rf, RefreshInfo } from './lib/auth'
import cookieParser from 'cookie-parser'
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
  console.log('Incoming request: ', `
    ip: ${req.ip}
    path: ${req.path}
    method: ${req.method}
  `)
  next()
})

app.get('/', (_req, res) => {
  res.send('Hello world!')
})

app.post('/api/refreshToken', async (req, res) => {
  const token = req?.cookies?.refreshToken
  if (token === null || token === undefined) {
    res.status(400).send({ error: 'missing payload' })
  } else {
    const { JWT, JWTExpiry, refreshToken }: RefreshInfo = await rf(token)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true
    })
    res.status(200).send({ JWT, JWTExpiry })
  }
})

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
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
