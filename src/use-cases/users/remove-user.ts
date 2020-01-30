import {IUserDB} from '../../db/User'

export default (db: IUserDB) => async (_id: string) => {
    const response = await db.remove(_id)
    return response
}