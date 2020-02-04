import express, { Request, Response } from 'express'
import {
    addPage,
    deletePage,
    updatePage,
    findPages
} from '../use-cases/pages'
import handleAuth from './handleAuth'
import { AuthenticatedRequest } from './routeTypes'

const router = express.Router()

router.get('/', async (req : Request, res : Response) => {
    const query = req.query;

    try {
        const pages = await findPages(query)
        return res.json(pages)
    } catch(e) {
        return res.status(400).json({error: e.message})
    }
})

router.post('/', async (req : Request, res : Response) => {
    const { title, authorid } = req.body

    try {
        const response = await addPage({title, authorid})
        return res.json(response)
    } catch(e) {
        return res.status(400).json({error: e.message})
    }
})

router.get('/_id/:_id', async (req : Request, res : Response) => {
    const _id = req.params._id

    try {
        const response = await findPages({_id})
        return res.json(response)
    } catch(e) {
        return res.status(400).json({error: e.message})
    }
})

router.post('/_id/:_id', handleAuth, async (req : AuthenticatedRequest, res : Response) => {
    const {title, authorid} = req.body
    const _id = req.params._id

    try {
        const response = await updatePage(_id, { title, authorid })
        return res.json(response)
    } catch(e) {
        return res.status(400).json({error: e.message})
    }
})

router.delete('/_id/:_id', handleAuth, async (req : AuthenticatedRequest, res : Response) => {
    const _id = req.params._id

    try {
        const response = await deletePage(_id)
        return res.json(response)
    } catch(e) {
        return res.status(400).json({error: e.message})
    }
})

export default router