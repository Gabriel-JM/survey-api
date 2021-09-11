import { LoginController } from '@/presentation/controllers/account/login/login-controller'
import { Controller } from '@/presentation/protocols'
import { makeLoginValidation } from './login-validation-factory'
import { makeDbAuthentication } from '@/main/factories/usecases'
import { makeLogControllerDecorator } from '@/main/factories/decorators'

export function makeLoginController (): Controller {
  const loginValidation = makeLoginValidation()
  const authentication = makeDbAuthentication()

  const loginController = new LoginController(authentication, loginValidation)

  return makeLogControllerDecorator(loginController)
}
