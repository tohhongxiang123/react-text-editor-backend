import { IUserDB } from "../../db/User";

export default (db: IUserDB, decodeToken: (token: string) => {username: string, _id: string}) => async (token: string) : Promise<{_id: string, username: string}> => {
    const {_id, username} = decodeToken(token)
    const users = await db.find({_id})

    if (users.length === 0) throw new Error('User not found')
    return {_id, username}
}