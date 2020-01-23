import makeAddUser from './add-user'
import makeLoginUser from './login-user'
import makeFindUsers from './find-users'
import { userDb } from '../../db'

import {genSaltSync, hashSync, compareSync} from 'bcryptjs'
import {sign} from 'jsonwebtoken'

const addUser = makeAddUser(userDb, hash)
const loginUser = makeLoginUser(userDb, checkPassword, generateToken)
const findUsers = makeFindUsers(userDb)

export {
    addUser,
    loginUser,
    findUsers
}

function hash(stringToHash : string) : string {
    const salt = genSaltSync();
    return hashSync(stringToHash, salt)
}

function checkPassword(password: string, hashedPassword: string) : boolean {
    return compareSync(password, hashedPassword)
}

function generateToken(payload: object) : string {
    return sign(payload, process.env.TOKEN_SECRET)
}