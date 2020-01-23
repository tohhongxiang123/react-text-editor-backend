const express = require('express')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

import documentRoutes from './routes/documentRoutes'
import userRoutes from './routes/userRoutes'
import schema from './schema'

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    if (err) return console.log(err)
    console.log(`Connected to mongoDB: ${process.env.MONGODB_URI}`)
})

const app = express()

app.use(cors())
app.use(express.json())

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))
app.use('/api/documents', documentRoutes)
app.use('/api/users', userRoutes)

app.get('/', async (req, res) => {
    return res.send("This is for testing")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))

