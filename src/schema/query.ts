import {
    GraphQLObjectType,
    GraphQLList,
    GraphQLID
} from 'graphql'
import DocType from './DocType'
import UserType from './UserType'
import PageType from './PageType'
import { findDocument } from '../use-cases/documents'
import { findUsers } from '../use-cases/users'
import { findPages } from '../use-cases/pages'

const query = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        document: {
            type: DocType,
            args: { _id: { type: GraphQLID }},
            async resolve(parent, args) {
                if (!args._id) return null
                return (await findDocument({_id: args._id}))[0]
            }
        },
        documents: {
            type: new GraphQLList(DocType),
            async resolve(parent, args) {
                return await findDocument({})
            }
        },
        parentDocuments: {
            type: new GraphQLList(DocType),
            async resolve(parent, args) {
                return await findDocument({childof: null})
            }
        },
        user: {
            type: UserType,
            args: {_id: { type: GraphQLID}},
            async resolve(parent, args) {
                return await findUsers({_id: args._id})
            }
        },
        users: {
            type: new GraphQLList(UserType),
            async resolve(parent, args) {
                return await findUsers({})
            }
        },
        userPages: {
            type: new GraphQLList(PageType),
            args: {userid: { type: GraphQLID }},
            async resolve(parent, args) {
                if (args.userid === null) return []
                return await findPages({authorid: args.userid})
            }
        },
        pages: {
            type: new GraphQLList(PageType),
            async resolve(parent, args) {
                return await findPages({})
            }
        },
        pageDocuments: {
            type: new GraphQLList(PageType),
            args: { pageId: {type: GraphQLID }},
            async resolve(parent, args) {
                return await findPages({_id: args.pageId})
            }
        }
    }
})

export default query