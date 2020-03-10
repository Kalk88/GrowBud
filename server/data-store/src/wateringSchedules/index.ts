import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInputObjectType,
    GraphQLNonNull,
    GraphQLInt,
    GraphQLList,
} from 'graphql'

import {
    getWateringSchedulesForUser,
    getWateringScheduleById,
    scheduleWateringFor,
    removeWateringScheduleById,
    updateWateringSchedule
} from '../lib/wateringSchedules'

import {
    verifyAndDecodeToken,
} from '../lib/auth'

import {
    parseTokenFromHeaders,
    parseUserIdFromToken
} from '../lib/http'

import * as log from '../logging'
import { Status } from '../schema/types'

const nonNullGqlString = { type: new GraphQLNonNull(GraphQLString) }
const interval = { type: GraphQLInt, description: "The interval (in days) with which schedules should be updated where interval >= 1." }

const getUserId = context => parseTokenFromHeaders(context)
    .then(verifyAndDecodeToken)
    .then(parseUserIdFromToken)

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
        id: { type: GraphQLString, description: 'id of the Plant' },
        name: nonNullGqlString,
    }
})

const Plant = new GraphQLObjectType({
    name: "Plant",
    description: "Information about a plant.",
    fields: () => ({
        id: { type: GraphQLString, description: 'id of the Plant' },
        name: nonNullGqlString,
    })
})

const wateringScheduleById = {
    name: 'wateringScheduleById',
    description: 'The watering schedule by schedule id.',
    type: WateringSchedule,
    args: {
        id: nonNullGqlString,
    },
    resolve: async (_root, args, context) => {
        return getUserId(context)
            .then(userId => {
                log.info('Retrieving schedule for user: ', userId)
                return getWateringScheduleById(args.id)
            })
            .catch(err => { log.error(err); throw new Error('Invalid Request') })
    }
}

const wateringSchedulesByUserId = {
    name: 'wateringScheduleForUser',
    description: 'The watering schedules for a user by user id.',
    type: GraphQLList(WateringSchedule),
    args: {
        offset: {
            type: GraphQLString,
            description: 'The document id to start from.'
        },
        limit: {
            type: GraphQLInt,
            description: 'The number of schedules to retrieve. Defaults to 10.'
        }
    },
    resolve: async (_root, args, context) => {
        const limit = args.limit ?? 10
        return getUserId(context)
            .then(userId => {
                log.info('Retrieve watering schedules for ', userId)
                log.debug('with offset:', args.offset, 'and limit:', limit)
                return getWateringSchedulesForUser(userId, args.offset ? args.offset : null, limit)
            }
                )
            .catch(err => { log.error(err); throw new Error('Invalid Request') })
    }
}
 const nextWateringDateFor = {
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
        return getUserId(context)
            .then(userId => {
                log.info('Adding watering schedule for: ', userId)
                return scheduleWateringFor(args.plants ?? {}, userId, args.timestamp, args.interval)
            })
            .catch(err => { log.error(err); throw new Error('Invalid Request') })
    }
}
 const updateWateringScheduleForUser = {
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
        return getUserId(context)
            .then(userId => {
                log.info('Updating schedule for: ', userId)
                return updateWateringSchedule(args.scheduleId, args.plants ?? {}, userId, args.timestamp, args.interval)
            })
            .catch(err => { log.error(err); throw new Error('Invalid Request') })
    }
}

const deleteWateringSchedule = {
    description: "Remove a schedule.",
    type: Status,
    args: {
        id: nonNullGqlString,
    },
    resolve: async (_root, args, context) => {
        return getUserId(context)
            .then(userId => {
                log.info('Removing schedule for: ', userId)
                return removeWateringScheduleById(args.id)
            } )
            .catch(err => { log.error(err); throw new Error('Invalid Request') })
    }
}

export {
    wateringScheduleById,
    wateringSchedulesByUserId,
    nextWateringDateFor,
    updateWateringScheduleForUser,
    deleteWateringSchedule
}