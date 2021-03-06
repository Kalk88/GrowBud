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
import * as log from '../logging'
import {
    parseTokenFromHeaders,
    parseUserIdFromToken
} from '../lib/http'

const nonNullGqlString = { type: new GraphQLNonNull(GraphQLString) }
const interval = { type: GraphQLInt, description: "The interval (in days) with which schedules should be updated where interval >= 1." }

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
            resolve: async (_root, args, context) => {
                return parseTokenFromHeaders(context)
                    .then(verifyAndDecodeToken)
                    .then(parseUserIdFromToken)
                    .then(userId => {
                        log.info('Retrieving schedule for user: ', userId)
                        return getWateringScheduleById(args.id)
                    })
                    .catch(err => { log.error(err); throw new Error('Invalid Request') })
            }
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
                    .then(userId => {
                        log.info('Retrieve watering schedules for ', userId)
                        log.debug('with offset:', args.offset, 'and limit:', limit)
                        return getWateringSchedulesForUser(userId, args.offset ? args.offset : null, limit)
                    }
                        )
                    .catch(err => { log.error(err); throw new Error('Invalid Request') })
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
                log.info('Successfully logged in', id)
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
                log.info('Successfully registered', cred.email)
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
                    .catch(err => { log.error(err); throw new Error('Invalid Request') })
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
                    .then(userId => {
                        log.info('Adding watering schedule for: ', userId)
                        return scheduleWateringFor(args.plants ?? {}, userId, args.timestamp, args.interval)
                    })
                    .catch(err => { log.error(err); throw new Error('Invalid Request') })
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
                    .then(userId => {
                        log.info('Updating schedule for: ', userId)
                        return updateWateringSchedule(args.scheduleId, args.plants ?? {}, userId, args.timestamp, args.interval)
                    })
                    .catch(err => { log.error(err); throw new Error('Invalid Request') })
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
                    .then(parseUserIdFromToken)
                    .then(userId => {
                        log.info('Removing schedule for: ', userId)
                        return removeWateringScheduleById(args.id)
                    } )
                    .catch(err => { log.error(err); throw new Error('Invalid Request') })
            }
        }
    })
})

export default new GraphQLSchema({
    mutation: mutationType,
    query: queryType
})