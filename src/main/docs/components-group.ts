import { badRequest, forbidden, notFound, serverError, unauthorized } from './components'
import { apiKeyAuthSchema } from './schemas'

export const components = {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthSchema
  },
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  serverError
} as const
