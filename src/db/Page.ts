import { Pool } from 'pg'
import { IDB } from './index'

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: parseInt(process.env.PORT),
    database: process.env.DATABASE
})

export type Page = {
    _id?: string,
    title: string,
    authorid: string
}

export interface IPageDB extends IDB<Page> {}

export default () : IPageDB => {
    return Object.freeze({
        find,
        update,
        remove,
        create
    })

    async function find(query : {_id?: string, title?: string, authorid?: string}) : Promise<Page[]> {     
        const {_id, title, authorid} = query
        const response = await pool.query(`
            SELECT * FROM pages WHERE
            ($1::uuid IS NULL OR _id = $1::uuid) AND
            ($2::text IS NULL OR title = $2::text) AND
            ($3::text IS NULL OR authorid = $3::uuid)
        `, [_id, title, authorid])
        return response.rows
    }

    async function update(_id : string, changes : Page) : Promise<{modifiedCount: number, _id: string}> {
        const {title} = changes
        const response = await pool.query(`
            UPDATE pages
            SET title=$1, datemodified=now()
            WHERE _id::text = $2
        `, [title, _id] )
        return {modifiedCount: response.rowCount, _id}
    }

    async function remove(_id : string) : Promise<{deletedCount: number, _id: string}> {
        const response = await pool.query(`DELETE FROM pages WHERE _id::text=$1`, [_id])
        return {deletedCount: response.rowCount, _id}
    }

    async function create(pageInfo: Page) : Promise<Page> {
        const {title, authorid} = pageInfo
        const response = await pool.query(`
            INSERT INTO pages (title, authorid) 
            VALUES ($1, $2)
            RETURNING _id, title, datecreated, datemodified, authorid`,
            [title, authorid]
        )

        return response.rows[0]
    }
}