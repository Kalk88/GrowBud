import gql from 'graphql-tag';

export const ADD_WATERINGSCHEDULE = gql `
    mutation ($plants: [plantInput], $userId: String!, $timestamp: String!, $interval: Int!){
        nextWateringDateFor(plants: $plants, userId: $userId, timestamp: $timestamp, interval: $interval  ) {
            id
            plants{name}
            nextTimeToWater
        }
    }
`

export const GET_MY_WATERINGSCHEDULES = gql `
    query ($userId: String!){
        wateringScheduleForUser(userId: $userId) {
            id
            plants { name }
            nextTimeToWater
            interval
        }
    }
`

export const UPDATE_WATERINGSCHEDULE = gql `
    mutation($scheduleId: String!, $plants: [plantInput], $userId: String!, $timestamp: String!, $interval: Int!){
        updateWateringSchedule(scheduleId: $scheduleId, plants: $plants, userId: $userId, timestamp: $timestamp, interval: $interval){
            id
        }
    }
`