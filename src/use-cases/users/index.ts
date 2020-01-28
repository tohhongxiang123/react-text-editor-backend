import makeAddUser from './add-user'
import makeLoginUser from './login-user'
import makeFindUsers from './find-users'
import makeVerifyToken from './verify-token'
import makeUpdateUser from './update-user'
import { userDb } from '../../db'

import {genSaltSync, hashSync, compareSync} from 'bcryptjs'
import {sign, verify} from 'jsonwebtoken'

const addUser = makeAddUser(userDb, hash)
const loginUser = makeLoginUser(userDb, checkPassword, generateToken)
const findUsers = makeFindUsers(userDb)
const verifyToken = makeVerifyToken(userDb, decodeToken)
const updateUser = makeUpdateUser(userDb, hash)

export {
    addUser,
    loginUser,
    findUsers,
    updateUser,
    verifyToken
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

function decodeToken(token: string) : {username: string, _id: string} {
    return (<{username: string; _id: string}>verify(token, process.env.TOKEN_SECRET))
}