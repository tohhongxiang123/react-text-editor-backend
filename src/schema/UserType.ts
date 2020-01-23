import {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLList
} from 'graphql'
import {findDocument} from '../use-cases/documents'
import DocType from './DocType'

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: { type: GraphQLID },
        username: { type: GraphQLString },
        documents: {
            type: GraphQLList(DocType),
            resolve(parent, args) {
                return findDocument({authorId: parent._id})
            }
        }
    })
})

export default UserType