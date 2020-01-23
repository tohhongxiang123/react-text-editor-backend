import { Document, IDocumentDB } from "../../db/Document"

const makeFindDocument = (db : IDocumentDB) => async (query : any) : Promise<Document[]> => {
    const results = await db.find(query)
    return results
}

export default makeFindDocument