import gql from 'graphql-tag';

export const ADD_WATERINGSCHEDULE = gql `
mutation ($plants: String!, $userId: String!, $timestamp: String!, $interval: Int!){
	nextWateringDateFor(plants: $plants, userId: $userId, timestamp: $timestamp, interval: $interval  ) {
        id
        plant
        nextTimeToWater
    }
}`