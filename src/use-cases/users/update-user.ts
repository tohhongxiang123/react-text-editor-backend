import { IUserDB, User, MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from "../../db/User";

export default (db: IUserDB, hash: (stringToHash : string) => string, checkPassword: (password: string, hashedPassword: string) => boolean, generateToken: (payload: {_id: string, username: string}) => string) => 
    async (_id: string, updatedInfo : User, originalInfo : User) => {
        const users = await db.find({_id})

        if (users.length < 1) throw new Error(`User ${_id} not found`)

        const originalUser = users[0]

        const passwordValid = checkPassword(originalInfo.password, originalUser.password)
        if (!passwordValid) throw new Error('Incorrect password')

        const updatedUser = {
            ...originalUser, ...updatedInfo
        }

        if (updatedUser.username.length < MIN_USERNAME_LENGTH) {
            throw new Error(`Username has to be at least ${MIN_USERNAME_LENGTH} characters`)
        }

        if (updatedUser.username !== originalUser.username) {
            const exists = await db.find({username: updatedUser.username})
            if (exists.length > 0) throw new Error(`Username ${updatedUser.username} is already in use`)
        }

        if (updatedUser.password.length < MIN_PASSWORD_LENGTH) {
            throw new Error(`Password has to be at least ${MIN_PASSWORD_LENGTH} characters`)
        }
        updatedUser.password = hash(updatedUser.password)
        
        await db.update(_id, updatedUser)
        const token = generateToken({_id: updatedUser._id, username: updatedUser.username})
        return token
    }