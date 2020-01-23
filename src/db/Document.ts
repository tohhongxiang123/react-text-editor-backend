import mongoose = require('mongoose');
import { IDB } from './index'

export type Document = {
    title: string,
    description: string,
    body: string,
    authorId: string,
    childOf?: string,
    _id?: string
}

export interface IDocumentDB extends IDB<Document> {}

const Schema = mongoose.Schema
const documentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    body: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    childOf: {
        type: String,
        default: null
    }
})
const Document = mongoose.model('Document', documentSchema)

export type Error = {
    message: string,
    details?: any
}



export default () : IDocumentDB => {
    return Object.freeze({
        find,
        update,
        remove,
        create
    })

    async function find(query : {title? : string, description? : string, body?: string, childOf?: string[], _id?: string, authorId?: string}) : Promise<Document[]> {     
        // to perform regex match on the _id, we must convert it into a string since it was a mongodb objectId
        if (query.hasOwnProperty('_id') && !query._id.toString().match(/^[0-9a-fA-F]{24}$/)) throw new Error("Invalid ID")
        const results = await Document.find(query)
        return results.map(result => result.toObject())
    }

    async function update(_id : string, changes : any) : Promise<{modifiedCount: number, _id: string}> {
        if (!_id.match(/^[0-9a-fA-F]{24}$/)) throw new Error("Invalid ID")
        const response = await Document.updateOne({_id}, {$set: changes})

        const modifiedCount = response.nModified
        return {modifiedCount, _id}
    }

    async function remove(_id : string) : Promise<{deletedCount: number, _id: string}> {
        const {deletedCount} = await Document.deleteOne({_id: mongoose.Types.ObjectId(_id)})
        
        return {deletedCount, _id}
    }

    async function create(documentInfo: Document) : Promise<Document> {
        const document = new Document(documentInfo)
        const response = await document.save()
        return response
    }
}