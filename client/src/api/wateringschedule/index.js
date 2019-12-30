import gql from 'graphql-tag';

export const ADD_WATERINGSCHEDULE = gql `
mutation ($plants: [plantInput], $userId: String!, $timestamp: String!, $interval: Int!){
	nextWateringDateFor(plants: $plants, userId: $userId, timestamp: $timestamp, interval: $interval  ) {
        id
        plants{name}
        nextTimeToWater
    }
}`