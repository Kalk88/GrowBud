import {
    GraphQLObjectType,
    GraphQLBoolean
} from 'graphql'
const Status = new GraphQLObjectType({
    name: "Status",
    description: "Status of operation, evaluates to True or False",
    fields: () => ({
        status: { type: GraphQLBoolean }
    })
})

export {Status}