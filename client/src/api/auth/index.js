import gql from 'graphql-tag';

export const LOGIN = gql `
mutation ($email: String!,$password: String!){
	login(email: $email, password: $password) {
		JWT
    }
}`