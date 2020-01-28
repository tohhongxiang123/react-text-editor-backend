import * as express from 'express'
import {
    addUser,
    loginUser,
    findUsers,
    updateUser,
    verifyToken
} from '../use-cases/users'

const router = express.Router()

router.post('/register', async (req, res) => {
    const {username, password} = req.body
    try {
        const response = await addUser({username, password})
        return res.json(response)
    } catch(e) {
        return res.status(400).json({error: e.message})
    }
})

router.post('/login', async (req, res) => {
    const {username, password} = req.body
    try {
        const token = await loginUser(username, password)
        return res.cookie('auth-token', token).json({token})
    } catch(e) {
        return res.status(401).json({error: e.message})
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

router.get('/verify', async (req, res) => {
    const authHeader = req.headers['authorization']

    if (!authHeader) {
        return res.status(401).json({error : 'Bearer authentication required'})
    }

    const token = authHeader.split(' ')[authHeader.split(' ').length - 1]

    try {
        const user = await verifyToken(token)
        return res.json(user)
    } catch(e) {
        return res.status(401).clearCookie('auth-token').json({error: 'Invalid token', details: {...e}})
    }
})

router.get('/_id/:_id', async (req, res) => {
    const {_id} = req.params

    try {
        const users = await findUsers({_id})
        const user = users[0]
        return res.json(user)
    } catch(e) {
        return res.json({error: e.message})
    }
})

router.post('/_id/:_id', async (req, res) => {
    const updatedInfo = req.body
    const {_id} = req.params
    try {
        const response = await updateUser(_id, updatedInfo)
        return res.json(response)
    } catch(e) {
        return res.status(400).json({error: e.message})
    }
})

router.get('/logout', async (req, res) => {
    return res.clearCookie('auth-token').send('Logged out')
})

export default router