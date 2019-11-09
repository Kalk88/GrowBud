import gql from 'graphql-tag';

export const LOGIN = gql `
mutation ($email: String!,$password: String!){
	login(email: $email, password: $password) {
		JWT
    }
}`

export const REGISTER_USER = gql `
mutation ($userName: String!, $email: String!, $password: String!){
	register(email: $email, password: $password, userName: $userName,) {
        JWT
        userName
    }
}`
