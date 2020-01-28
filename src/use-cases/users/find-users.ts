import { IUserDB } from "../../db/User";

export default (db: IUserDB) => async (query: any) => {
    let users = await db.find(query)
    users = users.map(user => {
        delete user.password
        return user
    })
    return users
}