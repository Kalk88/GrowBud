import gql from 'graphql-tag';

export const CREATE_USER_MUTATION = gql `
  mutation createUser($user: UserInput!) {
    createUser(user: $user)
}