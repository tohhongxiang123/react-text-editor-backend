import {IDocumentDB} from '../../db/Document'

const makeUpdateDocument = (db : IDocumentDB) => async (_id : string, changes : Object) : Promise<{modifiedCount: number, _id: string}> => {
    if (!_id.match(/^[0-9a-fA-F]{24}$/)) throw new Error("Invalid ID") 
    
    const document = await db.find({_id})
    if (document.length === 0) throw new Error('Document not found')

    const response = await db.update(_id, changes)
    return response
}

export default makeUpdateDocument