import makeDocumentDb from './Document'
import makeUserDb from './User'

export interface IDB<T> {
    create: (information : T) => Promise<T>
    find: (query: any) => Promise<T[]>,
    update: (_id: string, changes: any) => Promise<{modifiedCount: number, _id: string}>,
    remove: (_id: string) => Promise<{deletedCount: number, _id: string}>
}

const documentDb = makeDocumentDb()
const userDb = makeUserDb()

export {
    documentDb, 
    userDb
}