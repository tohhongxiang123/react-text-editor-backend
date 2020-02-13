import makeDocumentDb from './Document'
import makeUserDb from './User'
import makePageDb from './Page'
import { Pool } from 'pg'

export interface IDB<T> {
    create: (information : T) => Promise<T>
    find: (query: any) => Promise<T[]>,
    update: (_id: string, changes: T) => Promise<{modifiedCount: number, _id: string}>,
    remove: (_id: string) => Promise<{deletedCount: number, _id: string}>
}

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: parseInt(process.env.PORT),
    database: process.env.DATABASE
})

const documentDb = makeDocumentDb(pool)
const userDb = makeUserDb(pool)
const pageDb = makePageDb(pool)

export {
    documentDb, 
    userDb,
    pageDb
}