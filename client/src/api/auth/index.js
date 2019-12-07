import gql from 'graphql-tag';
import axios from 'axios'

var API = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    timeout: 30000,
});

export function refreshToken(){
    return API.post('/api/refreshToken', {}, {withCredentials: true});
}



export const LOGIN = gql `
mutation ($email: String!,$password: String!){
	login(email: $email, password: $password) {
        JWT
        JWTExpiry
        id
    }
}`

export const REGISTER_USER = gql `
mutation ($userName: String!, $email: String!, $password: String!){
	register(email: $email, password: $password, userName: $userName,) {
        JWT
        userName
    }
}`
