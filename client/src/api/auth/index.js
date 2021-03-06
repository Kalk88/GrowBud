import gql from 'graphql-tag';
import axios from 'axios'
import store from '../../store'
import router from '../../router'

var API = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
    timeout: 30000,
});

API.interceptors.response.use((response) => {
    if (response.status === 401) {
        store.dispatch('silentTokenRefresh');
    }
    return response;
}, (error) => {
    if (error.response && error.response.data) {
        if(router.app._route.path !=='/'){
            router.push('/');
        }
        return Promise.reject(error.response.data);
    }
    return Promise.reject(error.message);
})

export function refreshToken() {
    return API.post('/api/refreshToken', {}, {
        withCredentials: true
    });
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