import { makeExecutableSchema } from '@graphql-tools/schema'
import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import { GraphQLError } from 'graphql'
import { authDirectiveTransformer } from '../graphql/directive/auth'
import resolvers from '../graphql/resolvers'
import typeDefs from '../graphql/type-defs'

const errorsMap = {
  UserInputError: 400,
  AuthenticationError: 401,
  ForbiddenError: 403,
  unknown: 500
}

function handleErrors (response: any, errors?: readonly GraphQLError[]) {
  errors?.forEach(error => {
    response.data = undefined

    for (const errorName of Object.keys(errorsMap)) {
      if (checkError(error, errorName)) {
        response.http.status = errorsMap[errorName]
        return
      }
    }

    response.http.status = errorsMap.unknown
  })
}

function checkError (error: GraphQLError, errorName: string) {
  return [error.name, error.originalError?.name].some(name => name === errorName)
}

let schema = makeExecutableSchema({
  resolvers,
  typeDefs
})

schema = authDirectiveTransformer(schema)

export default (app: Express) => {
  const apolloServer = new ApolloServer({
    schema,
    plugins: [{
      requestDidStart: async () => ({
        willSendResponse: async ({ response, errors }) => handleErrors(response, errors)
      })
    }],
    context: ({ req }) => ({ req })
  })

  apolloServer.start()
    .then(() => apolloServer.applyMiddleware({ app }))
    .catch(err => console.log('Apollo Server Error: ', err))
}
