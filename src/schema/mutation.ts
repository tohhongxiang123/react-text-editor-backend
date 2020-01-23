import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull
} from 'graphql'
import UserType from './UserType'
import { addUser } from '../use-cases/users'

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            async resolve(parent, args) {
                const response = await addUser({username: args.username, password: args.password})
                return response
            }
        }
    }
})

export default mutation