import { Document, IDocumentDB } from '../../db/Document'

const makeAddDocument = (db : IDocumentDB) => async (documentInfo: Document) : Promise<Document> => {
    if (!documentInfo.title.trim()) throw new Error('Title required')
    if (!documentInfo.description.trim()) throw new Error('Description required')
    if (!documentInfo.body.trim()) throw new Error('Body required')
    
    if (documentInfo.childOf) {
        const parent = await db.find({_id: documentInfo.childOf})
        if (parent.length === 0) throw new Error('Parent not found')
    }

    // we want the title, description and body to be trimmed
    const response = await db.create({
        ...documentInfo,
        title: documentInfo.title.trim(), 
        description: documentInfo.description.trim(), 
        body: documentInfo.description.trim()
    })

    return response
}

export default makeAddDocument