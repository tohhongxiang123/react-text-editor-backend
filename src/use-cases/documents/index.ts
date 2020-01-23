import makeFindDocument from './find-document'
import makeAddDocument from './add-document'
import makeDeleteDocument from './delete-document'
import makeUpdateDocument from './update-document'
import {documentDb} from '../../db'

const findDocument = makeFindDocument(documentDb)
const addDocument = makeAddDocument(documentDb)
const deleteDocument = makeDeleteDocument(documentDb)
const updateDocument = makeUpdateDocument(documentDb)

export {
    findDocument,
    addDocument,
    deleteDocument,
    updateDocument
}