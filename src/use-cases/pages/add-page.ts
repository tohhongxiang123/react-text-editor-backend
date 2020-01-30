import { IPageDB, Page } from '../../db/Page'

export default (db: IPageDB) => async ({title, authorid}) : Promise<Page> => {
    if (!title) throw new Error('Title required')
    if (!authorid) throw new Error('Author ID required')
    const response = await db.create({title, authorid})
    return response
}