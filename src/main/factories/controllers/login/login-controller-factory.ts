import { LoginController } from '../../../../presentation/controllers/account/login/login-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeLoginValidation } from './login-validation-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export function makeLoginController (): Controller {
  const loginValidation = makeLoginValidation()
  const authentication = makeDbAuthentication()

  const loginController = new LoginController(authentication, loginValidation)

  return makeLogControllerDecorator(loginController)
}
