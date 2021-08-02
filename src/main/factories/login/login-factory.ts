import { DbAuthenticationUseCase } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/cryptografy/bcrypt/bcrypt-adapter'
import { JWTAdapter } from '../../../infra/cryptografy/jwt/jwt-adapter'
import { MongoAccountRepository } from '../../../infra/db/mongodb/account/mongo-account-repository'
import { MongoLogRepository } from '../../../infra/db/mongodb/log/mongo-log-repository'
import { LoginController } from '../../../presentation/controllers/login/login-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'
import env from '../../config/env'

export function makeLoginController (): Controller {
  const loginValidation = makeLoginValidation()

  const encrypter = new JWTAdapter(env.jwtSecret)
  const salt = 12
  const hashComparer = new BcryptAdapter(salt)
  const accountRepository = new MongoAccountRepository()
  const authentication = new DbAuthenticationUseCase(
    accountRepository,
    hashComparer,
    encrypter,
    accountRepository
  )

  const loginController = new LoginController(authentication, loginValidation)

  const logRepository = new MongoLogRepository()

  return new LogControllerDecorator(loginController, logRepository)
}
