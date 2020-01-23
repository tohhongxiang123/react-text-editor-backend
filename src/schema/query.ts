import {
    GraphQLObjectType,
    GraphQLList,
    GraphQLID
} from 'graphql'
import DocType from './DocType'
import UserType from './UserType'
import { findDocument } from '../use-cases/documents'
import { findUsers } from '../use-cases/users'

const query = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        document: {
            type: DocType,
            args: { _id: { type: GraphQLID }},
            async resolve(parent, args) {
                return await findDocument({_id: args._id})
            }
        },
        documents: {
            type: new GraphQLList(DocType),
            async resolve(parent, args) {
                return await findDocument({})
            }
        },
        user: {
            type: UserType,
            args: {_id: { type: GraphQLID}},
            resolve(parent, args) {
                return findUsers({_id: args._id})
            }
        },
        users: {
            type: new GraphQLList(UserType),
            async resolve(parent, args) {
                return findUsers({})
            }
        }
    }
})

export default query