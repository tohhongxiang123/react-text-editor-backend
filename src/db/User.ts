import mongoose = require('mongoose')
import { IDB } from './index'

export type User = {
    username: string,
    password: string,
    _id?: string
}

export const MIN_PASSWORD_LENGTH = 6
export const MIN_USERNAME_LENGTH = 3

const Schema = mongoose.Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: MIN_PASSWORD_LENGTH
    }
})

const User = mongoose.model('User', userSchema)

export interface IUserDB extends IDB<User> {}

export default () : IUserDB => {
    return Object.freeze({
        create,
        find,
        update,
        remove
    })

    async function create(userInfo : User) : Promise<User> {
        const user = new User(userInfo)
        const response = await user.save()
        return response
    }

    async function find(query : {username?: string, _id?: string}) : Promise<User[]> {
        if (query.hasOwnProperty('_id') && !query._id.toString().match(/^[0-9a-fA-F]{24}$/)) throw new Error("Invalid ID")

        const results = await User.find(query)
        return results.map(result => result.toObject())
    }

    async function update(_id: string, changes: any) : Promise<{modifiedCount: number, _id: string}> {
        if (!_id.match(/^[0-9a-fA-F]{24}$/)) throw new Error("Invalid ID")
        const response = await User.updateOne({_id}, {$set: changes})

        const modifiedCount = response.nModified
        return {modifiedCount, _id}
    }

    async function remove(_id: string) : Promise<{deletedCount: number, _id: string}> {
        const {deletedCount} = await User.deleteOne({_id: mongoose.Types.ObjectId(_id)})
        
        return {deletedCount, _id}
    }
}