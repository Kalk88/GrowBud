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
    registerCredentials,
    userInfo
} from '../lib/auth'

import {
    getWateringSchedulesForUser,
    getWateringScheduleById,
    scheduleWateringFor
} from '../lib/db'

const nonNullGqlString = { type: new GraphQLNonNull(GraphQLString) }

/**
 * Types
 */
const JWT = new GraphQLObjectType({
    name: 'Login',
    description: 'Login info',
    fields: () => ({
        JWT: nonNullGqlString,
        JWTExpiry: nonNullGqlString,
        id: nonNullGqlString,
    })
})

const Registration = new GraphQLObjectType({
    name: 'Registration',
    description: 'Registration details',
    fields: () => ({
        JWT: nonNullGqlString,
        JWTExpiry: nonNullGqlString,
        email: nonNullGqlString,
        userName: nonNullGqlString,
        id: nonNullGqlString,
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
            resolve: async (_root, args) => getWateringScheduleById(args.id)
        },
        wateringScheduleForUser: {
            name: 'wateringScheduleForUser',
            description: 'The watering schedules for a user by user id',
            type: GraphQLList(WateringSchedule),
            args: {
                userId: nonNullGqlString,
                offset: {
                    type: GraphQLString,
                    description: 'The document id to start from.'
                },
                limit: {
                    type: GraphQLInt,
                    description: 'The number of schedules to retrieve. Defaults to 10'
                }
            },
            resolve: async (_root, args) => {
                const limit = args.limit ?? 10
                return getWateringSchedulesForUser(args.userId, args.offset, limit)
            }
        },
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
            resolve: async (_root, args, context) => {
                const { JWT, JWTExpiry, id, refreshToken }: userInfo = await login(args as Credential)
                // Modify the response object
                context.res.cookie('refreshToken', refreshToken, {
                    httpOnly: true
                })
                return {
                    JWT,
                    JWTExpiry,
                    id
                }
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
            resolve: async (_root, args, context) => {
                const cred: Credential = { email: args.email, password: args.password }
                const { JWT, JWTExpiry, id, refreshToken }: userInfo = await registerCredentials(cred)
                // Modify the response object
                context.res.cookie('refreshToken', refreshToken, {
                    httpOnly: true
                })
                return {
                    JWT,
                    JWTExpiry,
                    id,
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
                        }
                    })
                },
                userId: nonNullGqlString,
                timestamp: nonNullGqlString
            },
            resolve: async (_root, args) => scheduleWateringFor(args.plant ? args.plant : {}, args.userId, args.timestamp)
        }
    })
})

export default new GraphQLSchema({
    mutation: mutationType,
    query: queryType
})