import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean
} from 'graphql'

import {
    login,
    Credential,
    registerCredentials,
    userInfo
} from '../lib/auth'

const gqlString = { type: GraphQLString }

const JWTType = new GraphQLObjectType({
    name: 'Login',
    description: 'Login info',
    fields: () => ({
        JWT: gqlString,
        id: gqlString
    })
})

const RegistrationType = new GraphQLObjectType({
    name: 'Registration',
    description: 'Registration details',
    fields: () => ({
        JWT: gqlString,
        email: gqlString,
        userName: gqlString,
        id: gqlString
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
                const { JWT, id }: userInfo = await login(args as Credential)
                return {
                    JWT,
                    id
                }
            }
        },
        register: {
            description: 'Register an account.',
            type: RegistrationType,
            args: {
                email: gqlString,
                password: gqlString,
                userName: gqlString,
            },
            resolve: async (_root, args) => {
                const cred: Credential = { email: args.email, password: args.password }
                const { JWT, id }: userInfo = await registerCredentials(cred)
                return {
                    JWT,
                    id,
                    email: args.email,
                    userName: args.userName
                }
            }

        }
    })
})

export default new GraphQLSchema({
    mutation: mutationType,
    query: queryType
})