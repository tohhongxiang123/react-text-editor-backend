import { Pool } from 'pg'
import { IDB } from './index'

export type Document = {
    title: string,
    description: string,
    body: string,
    authorid: string,
    pageid: string
    childof?: string,
    datecreated?: Date,
    datemodified?: Date,
    _id?: string
}

export interface IDocumentDB extends IDB<Document> {}

export type Error = {
    message: string,
    details?: any
}

export default (pool: Pool) : IDocumentDB => {
    pool.query(`
    CREATE TABLE IF NOT EXISTS documents
    (
        _id uuid NOT NULL DEFAULT uuid_generate_v4(),
        title character varying(255) COLLATE pg_catalog."default" NOT NULL,
        description character varying(255) COLLATE pg_catalog."default" NOT NULL,
        body text COLLATE pg_catalog."default" NOT NULL,
        childof uuid,
        authorid uuid NOT NULL,
        datecreated timestamp without time zone DEFAULT now(),
        datemodified timestamp without time zone DEFAULT now(),
        pageid uuid NOT NULL,
        CONSTRAINT documents_pkey PRIMARY KEY (_id),
        CONSTRAINT documents_authorid_fkey FOREIGN KEY (authorid)
            REFERENCES public.users (_id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE CASCADE,
        CONSTRAINT documents_childof_fkey_cascade FOREIGN KEY (childof)
            REFERENCES public.documents (_id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE CASCADE,
        CONSTRAINT documents_pageid_fkey_cascade FOREIGN KEY (pageid)
            REFERENCES public.pages (_id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE CASCADE
    )
    `)
    return Object.freeze({
        find,
        update,
        remove,
        create
    })

    async function find(query : {title? : string, description? : string, body?: string, childof?: string[], _id?: string, authorid?: string, pageid?: string}) : Promise<Document[]> {     
        const {_id, title, description, body, childof, authorid, pageid} = query

        if (childof === null) {
            const response = await pool.query(`
                SELECT * FROM documents WHERE
                ($1::uuid IS NULL OR _id = $1::uuid) AND
                ($2::text IS NULL OR title = $2::text) AND
                ($3::text IS NULL OR description = $3::text) AND
                ($4::text IS NULL OR body = $4::text) AND
                ($5::uuid IS NULL OR authorid = $5) AND
                ($6::uuid IS NULL OR pageid = $6) AND
                childof IS NULL
            `, [_id, title, description, body, authorid, pageid])
            return response.rows
        } else {
            const response = await pool.query(`
                SELECT * FROM documents WHERE
                ($1::uuid IS NULL OR _id = $1::uuid) AND
                ($2::text IS NULL OR title = $2::text) AND
                ($3::text IS NULL OR description = $3::text) AND
                ($4::text IS NULL OR body = $4::text) AND
                ($5::text IS NULL OR childof = $5::uuid) AND
                ($6::uuid IS NULL OR authorid = $6::uuid) AND
                ($7::uuid IS NULL OR pageid = $7)
            `, [_id, title, description, body, childof, authorid, pageid])
            return response.rows
        }
    }

    async function update(_id : string, changes : Document) : Promise<{modifiedCount: number, _id: string}> {
        const {title, description, body, childof, authorid, pageid} = changes
        const response = await pool.query(`
            UPDATE documents
            SET title=$1, description=$2, body=$3, childof=$4, authorid=$5, pageid=$6, datemodified=now()
            WHERE _id::text = $7
        `, [title, description, body, childof, authorid, pageid, _id])
        return {modifiedCount: response.rowCount, _id}
    }

    async function remove(_id : string) : Promise<{deletedCount: number, _id: string}> {
        const response = await pool.query(`DELETE FROM documents WHERE _id::text=$1`, [_id])
        return {deletedCount: response.rowCount, _id}
    }

    async function create(documentInfo: Document) : Promise<Document> {
        const {title, description, body, childof, authorid, pageid} = documentInfo
        const response = await pool.query(`
            INSERT INTO documents (title, description, body, childof, authorid, pageid) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING _id, title, description, body, childof, authorid, datecreated, datemodified, pageid`,
            [title, description, body, childof, authorid, pageid]
        )

        return response.rows[0]
    }
}