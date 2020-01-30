import * as express from 'express'
import {
    addPage,
    deletePage,
    updatePage,
    findPages
} from '../use-cases/pages'

const router = express.Router()

router.get('/', async (req, res) => {
    const query = req.query;

    try {
        const pages = await findPages(query)
        return res.json(pages)
    } catch(e) {
        return res.status(400).json({error: e.message})
    }
})

router.post('/', async (req, res) => {
    const { title, authorid } = req.body

    try {
        const response = await addPage({title, authorid})
        return res.json(response)
    } catch(e) {
        return res.status(400).json({error: e.message})
    }
})

router.get('/_id/:_id', async (req, res) => {
    const _id = req.params._id

    try {
        const response = await findPages({_id})
        return res.json(response)
    } catch(e) {
        return res.status(400).json({error: e.message})
    }
})

router.post('/_id/:_id', async (req, res) => {
    const {title, authorid} = req.body
    const _id = req.params._id

    try {
        const response = await updatePage(_id, { title, authorid })
        return res.json(response)
    } catch(e) {
        return res.status(400).json({error: e.message})
    }
})

router.delete('/_id/:_id', async (req, res) => {
    const _id = req.params._id

    try {
        const response = await deletePage(_id)
        return res.json(response)
    } catch(e) {
        return res.status(400).json({error: e.message})
    }
})

export default router