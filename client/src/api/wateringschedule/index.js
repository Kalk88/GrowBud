import gql from 'graphql-tag';

export const addWateringSchedule = gql `
mutation ($plant: {id: String! name:String!}, $userId: String!, $timestamp: String!, interval: Int!){
	nextWateringDateFor(plant: $plant, userId: $userId, timestamp: $timestamp, interval: $interval  ) {
        id
        plant
        nextTimeToWater
    }
}`