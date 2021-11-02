import express from 'express'
import setupStaticFiles from './static-files'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import setupSwagger from './swagger'
import setupApolloServer from './apollo-server'

const app = express()

setupApolloServer(app)
setupStaticFiles(app)
setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)

export default app
