import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean
} from 'graphql'

import {
    login,
    Credential,
    logout,
    registerCredentials
} from '../lib/auth'

const gqlString = { type: GraphQLString }

const JWTType = new GraphQLObjectType({
    name: 'JWT',
    description: 'JWT',
    fields: () => ({
        JWT: gqlString
    })
})

const RegistrationType = new GraphQLObjectType({
    name: 'Registration',
    description: 'Registration details',
    fields: () => ({
        email: gqlString,
        password: gqlString,
        userName: gqlString
    })
})


const queryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Query operations',
    fields: () => ({
        test: { type: GraphQLBoolean }
    })
})

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Mutation operations',
    fields: () => ({
        login: {
            description: 'Login with the given credentials, returns a JWT',
            type: JWTType,
            args: {
                email: gqlString,
                password: gqlString
            },
            resolve: async (_root, args) => {
                const JWT = await login(args as Credential)
                return { JWT }
            }
        },
        logout: {
            description: 'Logout the user',
            type: GraphQLBoolean,
            args: {
                JWT: gqlString
            },
            resolve: async (_root, args) => {
                await logout()
                return true
            }
        },
        register: {
            description: 'Register a user',
            type: RegistrationType,
            args: {
                email: gqlString,
                password: gqlString,
                userName: gqlString,
            },
            resolve: async (_root, args) => {
                const cred: Credential = { email: args.email, password: args.password }
                await registerCredentials(cred)
            }

        }
    })
})

export default new GraphQLSchema({
    mutation: mutationType,
    query: queryType
})