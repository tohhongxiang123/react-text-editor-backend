import { IPageDB } from '../../db/Page'

export default (db: IPageDB) => async (_id: string) => {
    const response = await db.remove(_id)
    return response;
}