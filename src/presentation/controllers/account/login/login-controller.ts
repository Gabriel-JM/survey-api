import { Authentication } from '@/domain/usecases'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { Validation } from '@/presentation/protocols/validation'
import { Controller, HttpResponse } from '@/presentation/protocols'

interface ControllerRequest {
  email: string
  password: string
}

export class LoginController implements Controller<ControllerRequest> {
  constructor (
    private readonly authentication: Authentication,
    private readonly validation: Validation
  ) {}

  async handle (request: ControllerRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request)

      if (error) {
        return badRequest(error)
      }

      const { email, password } = request

      const authenticationModel = await this.authentication.auth({
        email, password
      })

      if (!authenticationModel) {
        return unauthorized()
      }

      return ok(authenticationModel)
    } catch (err) {
      return serverError(err)
    }
  }
}
