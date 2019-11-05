import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLList,
} from 'graphql'

import {
    login,
    Credential,
    registerCredentials
} from '../lib/auth'

import {
    getWateringSchedulesForUser,
    getWateringScheduleById,
} from '../lib/db'

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
        wateringScheduleById: {
            name: 'wateringScheduleById',
            description: 'The watering schedule by schedule id',
            type: WateringSchedule,
            args: {
                id: nonNullGqlString,
            },
            resolve: async (_root, args) => await getWateringScheduleById(args.id)
        },
        wateringScheduleForUser: {
            name: 'wateringScheduleForUser',
            description: 'The watering schedules for a user by user id',
            type: GraphQLList(WateringSchedule),
            args: {
                userId: nonNullGqlString,
                offset: {
                    type: GraphQLInt,
                    description: 'The starting point for schedules to be retrieved, Defaults to 0'
                },
                limit: {
                    type: GraphQLInt,
                    description: 'The number of schedules to retrieve. Defaults to 10'
                }
            },
            resolve: async (_root, args) => await getWateringSchedulesForUser(args.userId, args.offset ? args.offset : 0, args.number ? args.number : 10)
        }
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