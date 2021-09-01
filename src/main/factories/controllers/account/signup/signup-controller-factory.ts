import { SignUpController } from '../../../../../presentation/controllers/account/signup/signup-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbAddAccount, makeDbAuthentication } from '../../../usecases'
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
