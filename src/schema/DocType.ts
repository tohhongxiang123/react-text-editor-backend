import {
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLList, 
    GraphQLString
} from 'graphql'
import {findDocument} from '../use-cases/documents'
import {findUsers} from '../use-cases/users'
import UserType from './UserType'

const DocType = new GraphQLObjectType({
    name: 'Document',
    fields: () => ({
        _id: { type: GraphQLID },
        childOf: { type: GraphQLID },
        children: {
            type: GraphQLList(DocType),
            async resolve(parent, args) {
                return await findDocument({childOf: parent._id})
            }
        },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        body: { type: GraphQLString },
        author: {
            type: UserType,
            async resolve(parent, args) {
                return (await findUsers({_id: parent.authorId}))[0]
            }
        }
    })
})

export default DocType