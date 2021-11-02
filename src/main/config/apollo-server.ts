import { ApolloServer } from 'apollo-server-express'
import { GraphQLRequestListener, BaseContext } from 'apollo-server-plugin-base'
import { Express } from 'express'
import { GraphQLError } from 'graphql'
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

export default (app: Express) => {
  const apolloServer = new ApolloServer({
    resolvers,
    typeDefs,
    plugins: [{
      requestDidStart: () => Promise.resolve({
        willSendResponse: ({ response, errors }) => Promise.resolve(handleErrors(response, errors))
      }) as Promise<GraphQLRequestListener<BaseContext>>
    }]
  })

  apolloServer.start()
    .then(() => apolloServer.applyMiddleware({ app }))
    .catch(err => console.log('Apollo Server Error: ', err))
}
