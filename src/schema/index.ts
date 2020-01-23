import query from './query'
import mutation from './mutation'
import { GraphQLSchema } from 'graphql'

export default new GraphQLSchema({
    query,
    mutation
})