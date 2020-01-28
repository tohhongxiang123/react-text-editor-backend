import { Pool } from 'pg'
import { IDB } from './index'

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: parseInt(process.env.PORT),
    database: process.env.DATABASE
})

export type Document = {
    title: string,
    description: string,
    body: string,
    authorid: string,
    childof?: string,
    _id?: string
}

export interface IDocumentDB extends IDB<Document> {}

export type Error = {
    message: string,
    details?: any
}

export default () : IDocumentDB => {
    return Object.freeze({
        find,
        update,
        remove,
        create
    })

    async function find(query : {title? : string, description? : string, body?: string, childof?: string[], _id?: string, authorid?: string}) : Promise<Document[]> {     
        const {_id, title, description, body, childof, authorid} = query

        if (childof === null) {
            const response = await pool.query(`
                SELECT * FROM documents WHERE
                ($1::uuid IS NULL OR _id = $1::uuid) AND
                ($2::text IS NULL OR title = $2::text) AND
                ($3::text IS NULL OR description = $3::text) AND
                ($4::text IS NULL OR body = $4::text) AND
                ($5::uuid IS NULL OR authorid = $5) AND
                childof IS NULL
            `, [_id, title, description, body, authorid])
            return response.rows
        } else {
            const response = await pool.query(`
                SELECT * FROM documents WHERE
                ($1::uuid IS NULL OR _id = $1::uuid) AND
                ($2::text IS NULL OR title = $2::text) AND
                ($3::text IS NULL OR description = $3::text) AND
                ($4::text IS NULL OR body = $4::text) AND
                ($5::text IS NULL OR childof = $5::uuid) AND
                ($6::uuid IS NULL OR authorid = $6::uuid)
            `, [_id, title, description, body, childof, authorid])
            return response.rows
        }
    }

    async function update(_id : string, changes : Document) : Promise<{modifiedCount: number, _id: string}> {
        const {title, description, body, childof, authorid} = changes
        const response = await pool.query(`
            UPDATE documents
            SET title=$1, description=$2, body=$3, childof=$4, authorid=$5
            WHERE _id::text = $6
        `, [title, description, body, childof, authorid, _id])
        return {modifiedCount: response.rowCount, _id}
    }

    async function remove(_id : string) : Promise<{deletedCount: number, _id: string}> {
        const response = await pool.query(`DELETE FROM documents WHERE _id::text=$1`, [_id])
        return {deletedCount: response.rowCount, _id}
    }

    async function create(documentInfo: Document) : Promise<Document> {
        const {title, description, body, childof, authorid} = documentInfo
        const response = await pool.query(`
            INSERT INTO documents (title, description, body, childof, authorid) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING _id, title, description, body, childof, authorid`,
            [title, description, body, childof, authorid]
        )

        return response.rows[0]
    }
}