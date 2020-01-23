import * as express from 'express'
import {
    addUser,
    loginUser,
    findUsers
} from '../use-cases/users'

const router = express.Router()

router.post('/register', async (req, res) => {
    const {username, password} = req.body
    try {
        const response = await addUser({username, password})
        return res.json(response)
    } catch(e) {
        return res.json({error: e.message})
    }
})

router.post('/login', async (req, res) => {
    const {username, password} = req.body
    try {
        const token = await loginUser(username, password)
        // set cookie too
        return res.json({token})
    } catch(e) {
        return res.json({error: e.message})
    }
})

router.get('/search', async (req, res) => {
    const query = req.query
    try {
        const users = await findUsers(query)
        return res.json({users})
    } catch(e) {
        return res.json({error: e.message})
    }
})

export default router