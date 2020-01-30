import {
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString,
    GraphQLList
} from 'graphql'
import DocType from './DocType'
import { findDocument } from '../use-cases/documents'
import UserType from './UserType'
import { findUsers } from '../use-cases/users'

const PageType = new GraphQLObjectType({
    name: 'Page',
    fields: () => ({
        _id: { type: GraphQLID },
        title: { type: GraphQLString },
        author: {
            type: UserType,
            async resolve(parent, args) {
                return (await findUsers({_id: parent.authorid}))[0]
            }
        },
        documents: {
            type: GraphQLList(DocType),
            async resolve(parent, args) {
                return await findDocument({pageid: parent._id, childof: null})
            }
        }
    })
})

export default PageType