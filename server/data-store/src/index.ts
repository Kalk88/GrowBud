require('dotenv').config()
import express from 'express'
import graphQLHTTP from 'express-graphql'
import schema from './schema'
import { refreshToken as rf, RefreshInfo } from './lib/auth'
const app = express()
const port = process.env.PORT ? process.env.PORT : 9090

app.use(express.json());
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST')
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

app.use('/graph/view', graphQLHTTP({
  schema,
  graphiql: true
}))

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
