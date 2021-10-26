import { AddAccount, Authentication } from '@/domain/usecases'
import { Controller, HttpResponse, Validation } from '@/presentation/protocols'
import { EmailInUseError } from '@/presentation/errors'
import { badRequest, forbidden, ok, serverError } from '../../../helpers/http/http-helper'

interface ControllerRequest {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

export class SignUpController implements Controller<ControllerRequest> {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (request: ControllerRequest): Promise<HttpResponse> {
    try {
      const validationError = this.validation.validate(request)

      if (validationError) {
        return badRequest(validationError)
      }

      const { name, email, password } = request

      const isValid = await this.addAccount.add({
        name,
        email,
        password
      })

      if (!isValid) {
        return forbidden(new EmailInUseError())
      }

      const authenticationModel = await this.authentication.auth({
        email,
        password
      })

      return ok(authenticationModel)
    } catch (err) {
      return serverError(err)
    }
  }
}
