import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/middlewares'

export const authMiddleware = adaptMiddleware(makeAuthMiddleware())
