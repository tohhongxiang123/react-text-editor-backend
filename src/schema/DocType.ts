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
        childof: { type: GraphQLID },
        children: {
            type: GraphQLList(DocType),
            async resolve(parent, args) {
                const children = await findDocument({childof: parent._id})
                return children
            }
        },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        body: { type: GraphQLString },
        author: {
            type: UserType,
            async resolve(parent, args) {
                const user = (await findUsers({_id: parent.authorid}))[0]
                return user
            }
        }
    })
})

export default DocType