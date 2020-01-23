import { IUserDB, User, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from "../../db/User";

export default (db: IUserDB, hash: (stringToHash : string) => string) => async (userInfo : User) => {
    const {username, password} = userInfo

    if (!password) throw new Error('Password required')
    if (!username) throw new Error('Username required')

    if (password.length < MIN_PASSWORD_LENGTH) {
        throw new Error(`Password has to be at least ${MIN_PASSWORD_LENGTH} characters`)
    }

    if (username.length < MIN_USERNAME_LENGTH) {
        throw new Error(`Username has to be at least ${MIN_USERNAME_LENGTH} characters`)
    }

    const userExists = await db.find({username})
    if (userExists.length > 0) throw new Error('Username already in use')

    const hashedPassword = hash(password)

    const response = await db.create({username, password: hashedPassword})
    return response
}