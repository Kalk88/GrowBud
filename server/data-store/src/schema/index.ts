import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLInputObjectType,
    GraphQLNonNull
} from 'graphql'

import {
    login,
    Credential,
    registerCredentials
} from '../lib/auth'

const nonNullGqlString = { type: new GraphQLNonNull(GraphQLString) }

/**
 * Types
 */
const JWT = new GraphQLObjectType({
    name: 'JWT',
    description: 'JWT',
    fields: () => ({
        JWT: nonNullGqlString
    })
})

const Registration = new GraphQLObjectType({
    name: 'Registration',
    description: 'Registration details',
    fields: () => ({
        JWT: nonNullGqlString,
        email: nonNullGqlString,
        userName: nonNullGqlString
    })
})

const WateringSchedule = new GraphQLObjectType({
    name: 'WateringSchedule',
    description: 'Information about a plant and when to water next.',
    fields: () => ({
        id: nonNullGqlString,
        userId: nonNullGqlString,
        plant: { type: Plant },
        nextTimeToWater: nonNullGqlString
    })
})

const Plant = new GraphQLObjectType({
    name: "Plant",
    description: "Information about a plant.",
    fields: () => ({
        id: nonNullGqlString,
        name: nonNullGqlString,
        description: nonNullGqlString
    })
})

/**
 * Queries
 */
const queryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Query operations',
    fields: () => ({
        test: { type: GraphQLBoolean }
    })
})

/**
 * Mutations
 */
const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Mutation operations',
    fields: () => ({
        login: {
            description: 'Login with the given credentials, returns a JWT',
            type: JWT,
            args: {
                email: nonNullGqlString,
                password: nonNullGqlString
            },
            resolve: async (_root, args) => {
                const JWT = await login(args as Credential)
                return { JWT }
            }
        },
        register: {
            description: 'Register an account.',
            type: Registration,
            args: {
                email: nonNullGqlString,
                password: nonNullGqlString,
                userName: nonNullGqlString,
            },
            resolve: async (_root, args) => {
                const cred: Credential = { email: args.email, password: args.password }
                const JWT = await registerCredentials(cred)
                return {
                    JWT,
                    email: args.email,
                    userName: args.userName
                }
            }
        },
        nextWateringDateFor: {
            description: "Set up a reminder for when to water a plant next.",
            type: WateringSchedule,
            args: {
                plant: {
                    type: new GraphQLInputObjectType({
                        name: 'plantInput',
                        fields: {
                            id: nonNullGqlString,
                            name: nonNullGqlString,
                            description: nonNullGqlString
                        }
                    })
                },
                timestamp: nonNullGqlString
            },
            resolve: async (_root, args) => {
                return {}
            }
        }
    })
})

export default new GraphQLSchema({
    mutation: mutationType,
    query: queryType
})