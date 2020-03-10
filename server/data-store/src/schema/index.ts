import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
} from 'graphql'

import {
    login,
    Credential,
    registerUser,
    removeUser,
    userInfo,
    verifyAndDecodeToken,
} from '../lib/auth'

import * as log from '../logging'
import {
    parseTokenFromHeaders,
    parseUserIdFromToken
} from '../lib/http'

import {
    wateringScheduleById,
    wateringSchedulesByUserId,
    nextWateringDateFor,
    updateWateringScheduleForUser,
    deleteWateringSchedule
} from '../wateringSchedules'

import { Status } from './types'

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

/**
 * Queries
 */
const queryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Query operations',
    fields: () => ({
        wateringScheduleById,
        wateringSchedulesByUserId
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
        nextWateringDateFor: nextWateringDateFor,
        updateWateringSchedule: updateWateringScheduleForUser,
        deleteWateringSchedule: deleteWateringSchedule
    })
})

export default new GraphQLSchema({
    mutation: mutationType,
    query: queryType
})