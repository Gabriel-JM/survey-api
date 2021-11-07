import { ApolloServer } from 'apollo-server-express'
import resolvers from '../resolvers'
import typeDefs from '../type-defs'

export async function makeApolloServer () {
  const server = new ApolloServer({
    resolvers,
    typeDefs,
    context: ({ req }) => ({ req })
  })

  await server.start()

  return server
}
