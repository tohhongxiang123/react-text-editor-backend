import { IDocumentDB } from '../../db/Document'

export default (db: IDocumentDB) => async (_id: string, requestorId: string) : Promise<{deletedCount: number, _id: string}> => {
    const documents = (await db.find({_id}))

    if (documents.length < 1) throw new Error(`Document ${_id} not found`)
    if (documents[0].authorid !== requestorId) throw new Error('Not allowed to delete other user pages')

    const response = await db.remove(_id)
    return response
}