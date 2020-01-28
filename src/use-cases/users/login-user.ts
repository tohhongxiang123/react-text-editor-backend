import { IUserDB } from "../../db/User";

export default (db: IUserDB, checkPassword: (password: string, hashedPassword: string) => boolean, generateToken: (payload: object) => string) => async (username: string, password: string) => {
    const users = await db.find({username})
    if (users.length < 1) throw new Error('User not found')

    const user = users[0]
    const isValid = checkPassword(password, user.password)

    if (!isValid) throw new Error('Incorrect Password')

    return generateToken({_id: user._id, username: user.username})
}