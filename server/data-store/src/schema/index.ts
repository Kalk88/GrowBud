import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean
} from 'graphql'

import {
    login,
    Credential,
    registerUser,
    removeUser,
    userInfo
} from '../lib/auth'

import {
    getWateringSchedulesForUser,
    getWateringScheduleById,
    scheduleWateringFor,
    removeWateringScheduleById
} from '../lib/db'

const nonNullGqlString = { type: new GraphQLNonNull(GraphQLString) }
const interval = { type: GraphQLInt, description: "The schedule interval represented as a unix timestamp." }

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
        nextTimeToWater: nonNullGqlString,
        interval
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
const Status = new GraphQLObjectType({
    name: "Status",
    description: "Status of operation, evaluates to True or False",
    fields: () => ({
        status: { type: GraphQLBoolean }
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
                const { JWT, JWTExpiry, id, refreshToken }: userInfo = await registerUser(cred, args.userName)
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
        unregister: {
            description: 'Remove a user from the application',
            type: Status,
            args: {
                id: nonNullGqlString
            },
            resolve: async (_root, args) => removeUser(args.id)
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
                timestamp: nonNullGqlString,
                interval
            },
            resolve: async (_root, args) => scheduleWateringFor(args.plant ?? {}, args.userId, args.timestamp, args.interval)
        },
        deleteWateringSchedule: {
            description: "Remove a schedule",
            type: Status,
            args: {
                id: nonNullGqlString,
            },
            resolve: async (_root, args) => removeWateringScheduleById(args.id)
        }
    })
})

export default new GraphQLSchema({
    mutation: mutationType,
    query: queryType
})