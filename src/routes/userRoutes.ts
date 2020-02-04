import express, { Request, Response } from 'express'
import {
    addUser,
    loginUser,
    findUsers,
    updateUser,
    removeUser,
    verifyToken
} from '../use-cases/users'
import handleAuth from './handleAuth'
import {AuthenticatedRequest} from './routeTypes'

const router = express.Router()

router.get('/', handleAuth, async (req: AuthenticatedRequest, res: Response) => {
    console.log({username: req.username, userid: req.userid})
    return res.send('Hello world')
})

router.post('/register', async (req : Request, res : Response) => {
    const {username, password} = req.body
    try {
        const response = await addUser({username, password})
        return res.json(response)
    } catch(e) {
        return res.status(400).json({error: e.message})
    }
})

router.post('/login', async (req : Request, res : Response) => {
    const {username, password} = req.body
    try {
        const token = await loginUser(username, password)
        return res.cookie('auth-token', token).json({token})
    } catch(e) {
        return res.status(401).json({error: e.message})
    }
})

router.get('/search', async (req : Request, res : Response) => {
    const query = req.query
    try {
        const users = await findUsers(query)
        return res.json({users})
    } catch(e) {
        return res.json({error: e.message})
    }
})

router.get('/verify', async (req : Request, res : Response) => {
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

router.get('/_id/:_id', async (req : Request, res : Response) => {
    const {_id} = req.params

    try {
        const users = await findUsers({_id})
        const user = users[0]
        return res.json(user)
    } catch(e) {
        return res.json({error: e.message})
    }
})

router.post('/_id/:_id', handleAuth, async (req : AuthenticatedRequest, res : Response) => {
    const {updatedInfo, originalInfo} = req.body
    const {_id} = req.params
    const authenticatedUserId = req.userid

    if (_id !== authenticatedUserId) return res.status(403).json({error: 'Not allowed to edit other users'})

    try {
        const token = await updateUser(_id, updatedInfo, originalInfo)
        return res.cookie('auth-token', token).json({token})
    } catch(e) {
        return res.status(400).json({error: e.message})
    }
})

router.delete('/_id/:_id', handleAuth, async (req : AuthenticatedRequest, res : Response) => {
    const _id = req.params._id;
    const authenticatedUserId = req.userid

    if (_id !== authenticatedUserId) return res.status(403).json({error: 'Not allowed to delete other users'})
    try {
        const response = await removeUser(_id)
        return res.json(response)
    } catch(e) {
        return res.json({error: e.message})
    }
})

router.get('/logout', async (req : Request, res : Response) => {
    return res.clearCookie('auth-token').send('Logged out')
})

export default router