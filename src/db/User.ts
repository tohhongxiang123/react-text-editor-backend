import { IDB } from './index'
import { Pool } from 'pg'

export type User = {
    username: string,
    password: string,
    _id?: string
}

export const MIN_PASSWORD_LENGTH = 6
export const MIN_USERNAME_LENGTH = 3

export interface IUserDB extends IDB<User> {}

export default (pool: Pool) : IUserDB => {
    pool.query(`CREATE TABLE IF NOT EXISTS users
    (
        _id uuid NOT NULL DEFAULT uuid_generate_v4(),
        username character varying(255) COLLATE pg_catalog."default" NOT NULL,
        password character varying(255) COLLATE pg_catalog."default" NOT NULL,
        CONSTRAINT users_pkey PRIMARY KEY (_id),
        CONSTRAINT username_unique UNIQUE (username)
    )`)
    return Object.freeze({
        create,
        find,
        update,
        remove
    })

    async function create(userInfo : User) : Promise<User> {
        const response = await pool.query(`
            INSERT INTO users (username, password) 
            VALUES ($1, $2)
            RETURNING _id, username`,
            [userInfo.username, userInfo.password]
        )
        return response.rows[0]
    }

    async function find(query : {username?: string, _id?: string}) : Promise<User[]> {
        // COALESCE returns '%' if variable is null
        const {rows} = await pool.query(`
            SELECT _id, username, password FROM users WHERE
            ($1::text IS NULL OR username = $1) AND
            ($2::uuid IS NULL OR _id = $2)
        `, [query.username, query._id])
        return rows
    }

    async function update(_id: string, changes: User) : Promise<{modifiedCount: number, _id: string}> {
        const response = await pool.query(`
            UPDATE users
            SET username=$1, password=$2
            WHERE _id::text = $3
        `, [changes.username, changes.password, _id])

        return {modifiedCount: response.rowCount, _id}
    }

    async function remove(_id: string) : Promise<{deletedCount: number, _id: string}> {
        const response = await pool.query(`DELETE FROM users WHERE _id::text=$1`, [_id])
        return {deletedCount: response.rowCount, _id}
    }
}