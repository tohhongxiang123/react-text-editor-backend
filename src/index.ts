import express, {Request,Response} from 'express'
import graphqlHTTP from 'express-graphql'
import cors from 'cors'
require('dotenv').config()

import documentRoutes from './routes/documentRoutes'
import userRoutes from './routes/userRoutes'
import pageRoutes from './routes/pageRoutes'
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
app.use('/api/pages', pageRoutes)

app.get('/', async (req : Request, res : Response) => {
    return res.send("This is for testing")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))

