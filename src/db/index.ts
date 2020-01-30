import makeDocumentDb from './Document'
import makeUserDb from './User'
import makePageDb from './Page'

export interface IDB<T> {
    create: (information : T) => Promise<T>
    find: (query: any) => Promise<T[]>,
    update: (_id: string, changes: T) => Promise<{modifiedCount: number, _id: string}>,
    remove: (_id: string) => Promise<{deletedCount: number, _id: string}>
}

const documentDb = makeDocumentDb()
const userDb = makeUserDb()
const pageDb = makePageDb()

export {
    documentDb, 
    userDb,
    pageDb
}