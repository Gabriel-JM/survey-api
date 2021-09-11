import { SignUpController } from '@/presentation/controllers/account/signup/signup-controller'
import { Controller } from '@/presentation/protocols'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbAddAccount, makeDbAuthentication } from '@/main/factories/usecases'
import { makeSignUpValidation } from './signup-validation-factory'

export function makeSignUpController (): Controller {
  const addAccount = makeDbAddAccount()
  const validationComposite = makeSignUpValidation()
  const authentication = makeDbAuthentication()

  const signUpController = new SignUpController(
    addAccount,
    validationComposite,
    authentication
  )

  return makeLogControllerDecorator(signUpController)
}
