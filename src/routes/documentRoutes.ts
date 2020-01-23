import * as express from 'express'
import { 
    findDocument, 
    addDocument, 
    deleteDocument,
    updateDocument
} from '../use-cases/documents'

const router = express.Router()

router.get('/', async (req, res) => {
    const query = req.query
    try {
        const results = await findDocument(query)
        return res.json(results)
    } catch(e) {
        return res.json({error: e.message})
    }
})

router.post('/create', async (req, res) => {
    const {title, description, body, authorId, childOf} = req.body

    try {
        const response = await addDocument({title, description, body, authorId, childOf})
        return res.json(response)
    } catch(e) {
        return res.json({error: e.message})
    }
})

router.get('/_id/:_id', async (req, res) => {
    try {
        const document = (await findDocument({_id: req.params._id}))
        if (document) return res.json(document)
        return res.status(404).json({})
    } catch(e) {
        return res.json({error: e.message})
    }
})

router.post('/_id/:_id', async (req, res) => {
    try {
        const _id = req.params._id
        const changes = req.body
    
        const response = await updateDocument(_id, changes)
        return res.json(response)
    } catch(e) {
        return res.json({error: e.message})
    }
})

router.delete('/_id/:_id', async (req, res) => {
    try {
        const _id = req.params._id
        const response = await deleteDocument(_id)
    
        return res.json(response)
    } catch(e) {
        return res.json({error: e.message})
    }
})

export default router