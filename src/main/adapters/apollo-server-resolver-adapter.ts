import { Controller } from '@/presentation/protocols'
import { ApolloError, AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-errors'

export function adaptResolver (controller: Controller) {
  return async (_parent: any, args = {}, context: any) => {
    const request = {
      ...args,
      accountId: context?.req?.accountId
    }

    const httpResponse = await controller.handle(request)

    switch (httpResponse.statusCode) {
      case 200:
      case 204:
        return httpResponse.body

      case 400:
        throw new UserInputError(httpResponse.body.message)

      case 401:
        throw new AuthenticationError(httpResponse.body.message)

      case 403:
        throw new ForbiddenError(httpResponse.body.message)

      default:
        throw new ApolloError(httpResponse.body.message)
    }
  }
}
