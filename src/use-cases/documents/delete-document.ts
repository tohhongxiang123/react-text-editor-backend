import { IDocumentDB } from '../../db/Document'

const deleteDocument = (db: IDocumentDB) => async (_id: string) : Promise<{deletedCount: number, _id: string}> => {
    const response = await db.remove(_id)
    return response
}

export default deleteDocument