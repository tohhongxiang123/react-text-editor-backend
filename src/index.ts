import * as express from 'express'
import * as graphqlHTTP from 'express-graphql'
import * as cors from 'cors'
require('dotenv').config()

import documentRoutes from './routes/documentRoutes'
import userRoutes from './routes/userRoutes'
import schema from './schema'

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

