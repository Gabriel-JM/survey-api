import { ApolloServer } from 'apollo-server-express'
import { Express } from 'express'
import resolvers from '../graphql/resolvers'
import typeDefs from '../graphql/type-defs'

export default (app: Express) => {
  const apolloServer = new ApolloServer({
    resolvers,
    typeDefs
  })

  apolloServer.start()
    .then(() => apolloServer.applyMiddleware({ app }))
    .catch(err => console.log('Apollo Server Error: ', err))
}
