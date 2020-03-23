import gql from 'graphql-tag';

export const ADD_WATERINGSCHEDULE = gql`
    mutation ($plants: [plantInput], $timestamp: String!, $interval: Int!){
        nextWateringDateFor(plants: $plants, timestamp: $timestamp, interval: $interval) {
            id
            plants{ name }
            nextTimeToWater
        }
    }
`

export const GET_MY_WATERINGSCHEDULES = gql`
    query {
        schedules: wateringScheduleForUser {
            id
            plants { name }
            nextTimeToWater
            interval
        }
    }
`

export const UPDATE_WATERINGSCHEDULE = gql`
    mutation($scheduleId: String!, $plants: [plantInput], $timestamp: String!, $interval: Int!){
        updateWateringSchedule(scheduleId: $scheduleId, plants: $plants, timestamp: $timestamp, interval: $interval){
            id
        }
    }
`

export const DELETE_WATERINGSCHEDULE = gql`
    mutation($scheduleId: String!){
        deleteWateringSchedule(id: $scheduleId){
            status
        }
    }
`