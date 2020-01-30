import { IPageDB } from '../../db/Page'

export default (db: IPageDB) => async (query : {_id?: string, title?: string, authorid?: string}) => {
    const response = await db.find(query)
    return response
}