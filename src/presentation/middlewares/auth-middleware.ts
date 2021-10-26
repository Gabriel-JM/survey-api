import { LoadAccountByToken } from '@/domain/usecases'
import { AccessDeniedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { HttpResponse, Middleware } from '../protocols'

interface MiddlewareRequest {
  accessToken: string
}

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (request: MiddlewareRequest): Promise<HttpResponse> {
    try {
      const xAccessToken = request.accessToken

      if (xAccessToken) {
        const account = await this.loadAccountByToken.load(xAccessToken, this.role)

        if (account) {
          return ok({ accountId: account.id })
        }
      }

      return forbidden(new AccessDeniedError())
    } catch (err) {
      return serverError(err)
    }
  }
}
