import express, { Request, Response } from 'express'
import { 
    findDocument, 
    addDocument, 
    deleteDocument,
    updateDocument
} from '../use-cases/documents'
import handleAuth from './handleAuth'
import { AuthenticatedRequest } from './routeTypes'

const router = express.Router()

router.get('/', async (req : Request, res : Response) => {
    const query = req.query
    try {
        const results = await findDocument(query)
        return res.json(results)
    } catch(e) {
        return res.json({error: e.message})
    }
})

router.get('/_id/:_id', async (req : Request, res : Response) => {
    try {
        const document = await findDocument({_id: req.params._id})
        if (document) return res.json(document)
        return res.status(404).json({error: `Document ${req.params._id} not found`})
    } catch(e) {
        return res.status(500).json({error: e.message})
    }
})

router.post('/create', handleAuth, async (req : AuthenticatedRequest, res : Response) => {
    const {title, description, body, authorid, childof, pageid} = req.body

    try {
        const response = await addDocument({title, description, body, authorid, childof, pageid})
        return res.json(response)
    } catch(e) {
        return res.status(500).json({error: e.message})
    }
})

router.post('/_id/:_id', handleAuth, async (req : AuthenticatedRequest, res : Response) => {
    const _id = req.params._id
    const changes = req.body
    const authorid = req.userid

    try {
        const response = await updateDocument(_id, authorid, changes)
        return res.json(response)
    } catch(e) {
        return res.status(500).json({error: e.message})
    }
})

router.delete('/_id/:_id', handleAuth, async (req : AuthenticatedRequest, res : Response) => {
    const userid = req.userid
    const _id = req.params._id

    try {
        const response = await deleteDocument(_id, userid)
    
        return res.json(response)
    } catch(e) {
        return res.status(500).json({error: e.message})
    }
})

export default router