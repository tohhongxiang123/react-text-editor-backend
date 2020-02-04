import {IDocumentDB, Document} from '../../db/Document'

const makeUpdateDocument = (db : IDocumentDB) => async (_id : string, authorid: string, changes : Document) : Promise<{modifiedCount: number, _id: string}> => {
    const documents = await db.find({_id})
    if (documents.length === 0) throw new Error('Document not found')

    if (authorid !== documents[0].authorid) throw new Error('Not allowed to edit page')

    const updatedDocument = {
        ...documents[0], ...changes
    }
    
    const response = await db.update(_id, updatedDocument)
    return response
}

export default makeUpdateDocument