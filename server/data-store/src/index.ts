require('dotenv').config()
import express from 'express'
import graphQLHTTP from 'express-graphql'
import schema from './schema'
const app = express()
const port = process.env.PORT ? process.env.PORT : 9090

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST')
  next()
})

app.get('/', (_req, res) => {
  res.send('Hello world!')
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


// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
