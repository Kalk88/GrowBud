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
    verifyAndDecodeToken,
} from '../lib/auth'

import {
    getWateringSchedulesForUser,
    getWateringScheduleById,
    scheduleWateringFor,
    removeWateringScheduleById,
    updateWateringSchedule
} from '../lib/wateringSchedules'
import { upsertDeviceToken } from '../lib/pushNotifcationToken'

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
const plantInput = new GraphQLInputObjectType({
    name: 'plantInput',
    fields: {
        id: { type: GraphQLString, description: 'uuid of the Plant' },
        name: nonNullGqlString,
    }
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
                offset: {
                    type: GraphQLString,
                    description: 'The document id to start from.'
                },
                limit: {
                    type: GraphQLInt,
                    description: 'The number of schedules to retrieve. Defaults to 10'
                }
            },
            resolve: async (_root, args, context) => {
                const limit = args.limit ?? 10
                return parseTokenFromHeaders(context)
                    .then(verifyAndDecodeToken)
                    .then(parseUserIdFromToken)
                    .then(userId => getWateringSchedulesForUser(userId, args.offset, limit))
                    .catch(err => { console.error(err); throw new Error('Invalid Request') })
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
            resolve: async (_root, _args, context) => {
                return parseTokenFromHeaders(context)
                    .then(verifyAndDecodeToken)
                    .then(parseUserIdFromToken)
                    .then(removeUser)
                    .catch(err => { console.error(err); throw new Error('Invalid Request') })
            }
        },
        nextWateringDateFor: {
            description: "Set up a reminder for when to water a plant next.",
            type: WateringSchedule,
            args: {
                plants: {
                    type: GraphQLList(plantInput)
                },
                timestamp: nonNullGqlString,
                interval
            },
            resolve: async (_root, args, context) => {
                return parseTokenFromHeaders(context)
                    .then(verifyAndDecodeToken)
                    .then(parseUserIdFromToken)
                    .then(userId => scheduleWateringFor(args.plants ?? {}, userId, args.timestamp, args.interval))
                    .catch(err => { console.error(err); throw new Error('Invalid Request') })
            }
        },
        updateWateringSchedule: {
            description: "Set up a reminder for when to water a plant next.",
            type: WateringSchedule,
            args: {
                scheduleId: nonNullGqlString,
                plants: {
                    type: GraphQLList(plantInput)
                },
                timestamp: nonNullGqlString,
                interval
            },
            resolve: async (_root, args, context) => {
                return parseTokenFromHeaders(context)
                    .then(verifyAndDecodeToken)
                    .then(parseUserIdFromToken)
                    .then(userId => updateWateringSchedule(args.scheduleId, args.plants ?? {}, userId, args.timestamp, args.interval))
                    .catch(err => { console.error(err); throw new Error('Invalid Request') })
            }
        },
        deleteWateringSchedule: {
            description: "Remove a schedule",
            type: Status,
            args: {
                id: nonNullGqlString,
            },
            resolve: async (_root, args, context) => {
                return parseTokenFromHeaders(context)
                    .then(verifyAndDecodeToken)
                    .then(_ => removeWateringScheduleById(args.id))
                    .catch(err => { console.error(err); throw new Error('Invalid Request') })
            }
        },
        upsertDeviceToken: {
            description: 'Add or update a users device token, for push notifications.',
            type: Status,
            args: {
                deviceToken: nonNullGqlString,
                deviceName: nonNullGqlString,
            },
            resolve: async (_root, args, context) => {
                return parseTokenFromHeaders(context)
                    .then(verifyAndDecodeToken)
                    .then(parseUserIdFromToken)
                    .then(userId => upsertDeviceToken(userId, args.deviceToken, args.deviceName, Date.now())
                        .catch(err => { console.error(err); throw new Error('Invalid Request') })
            }
        }
    })
})

const parseTokenFromHeaders = req => new Promise((resolve, _reject) =>
    resolve([req]
        .map(parseHeaders)
        .map(parseAuthorization)
        .map(bearer => bearer.split(' ')[1])[0]
    ))

const parseHeaders = req => {
    if (req.headers == null) throw new Error('Missing headers')
    return req.headers
}

const parseAuthorization = headers => {
    if (headers.authorization == null) throw new Error('Missing authorization header')
    return headers.authorization
}

const parseUserIdFromToken = token => token.uid

export default new GraphQLSchema({
    mutation: mutationType,
    query: queryType
})