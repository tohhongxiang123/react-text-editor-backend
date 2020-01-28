import { IDocumentDB } from '../../db/Document'

function makeDeleteDocument(db: IDocumentDB) {
    return async function deleteDocument(_id: string) : Promise<{deletedCount: number, _id: string}> {
        const response = await db.remove(_id)
        return response
    }
}
export default makeDeleteDocument