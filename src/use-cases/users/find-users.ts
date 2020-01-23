import { IUserDB } from "../../db/User";

export default (db: IUserDB) => async (query: any) => {
    const users = await db.find(query)
    return users
}