import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} from 'graphql'

import {
    login,
    Credential,
    registerUser,
    removeUser,
    userInfo,
    verifyToken,
} from '../lib/auth'

import {
    getWateringSchedulesForUser,
    getWateringScheduleById,
    scheduleWateringFor,
    removeWateringScheduleById
} from '../lib/db'
import { Result } from 'folktale/result'

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
        plants: { type: GraphQLList(Plant) },
        nextTimeToWater: nonNullGqlString,
        interval
    })
})

const Plant = new GraphQLObjectType({
    name: "Plant",
    description: "Information about a plant.",
    fields: () => ({
        id: { type: GraphQLString, description: 'uuid of the Plant' },
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
                await registerUser(cred, args.username)
                const { JWT, JWTExpiry, id, refreshToken }: userInfo = await login(cred)
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
                plants: {
                    type: GraphQLList(new GraphQLInputObjectType({
                        name: 'plantInput',
                        fields: {
                            id: { type: GraphQLString, description: 'uuid of the Plant' },
                            name: nonNullGqlString,
                        }
                    }))
                },
                userId: nonNullGqlString,
                timestamp: nonNullGqlString,
                interval
            },
            resolve: async (_root, args, context) => {
                parseTokenFromHeaders(context.req).matchWith({
                    Ok: async ({ value }) => {
                        userIdMatchesJWTId(args.userId, value).then(isValid => {
                            if (isValid) return scheduleWateringFor(args.plant ?? {}, args.userId, args.timestamp, args.interval)
                            throw Error('invalid Request')
                        })
                    },
                    Error: ({ value }) => { throw Error(value) }
                })
            }
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

const parseTokenFromHeaders = req => [req].map(parseHeaders)
    .map(parseAuthorization)[0]

const parseHeaders = req =>
    req.headers ? Result.Ok(req.headers)
        : Result.Error('missing headers')

const parseAuthorization = headers =>
    headers.authorization ? Result.Ok(headers.authorization)
        : Result.Error('missing authorization header')

function userIdMatchesJWTId(userId: string, token: string): Promise<boolean> {
    return verifyToken(token)
        .then(id => id === userId)
}

export default new GraphQLSchema({
    mutation: mutationType,
    query: queryType
})