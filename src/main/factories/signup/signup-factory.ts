import { DbAddAccountUseCase } from '../../../data/usecases/add-account/db-add-account'
import { DbAuthenticationUseCase } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/cryptografy/bcrypt/bcrypt-adapter'
import { JWTAdapter } from '../../../infra/cryptografy/jwt/jwt-adapter'
import { MongoAccountRepository } from '../../../infra/db/mongodb/account/mongo-account-repository'
import { MongoLogRepository } from '../../../infra/db/mongodb/log/mongo-log-repository'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../presentation/protocols'
import env from '../../config/env'
import { LogControllerDecorator } from '../../decorators/log/log-controller-decorator'
import { makeSignUpValidation } from './signup-validation-factory'

export function makeSignUpController (): Controller {
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  const addAccountRepository = new MongoAccountRepository()
  const addAccount = new DbAddAccountUseCase(hasher, addAccountRepository)

  const validationComposite = makeSignUpValidation()

  const encrypter = new JWTAdapter(env.jwtSecret)
  const accountRepository = new MongoAccountRepository()
  const authentication = new DbAuthenticationUseCase(
    accountRepository,
    hasher,
    encrypter,
    accountRepository
  )

  const signUpController = new SignUpController(
    addAccount,
    validationComposite,
    authentication
  )

  const mongoLogRepository = new MongoLogRepository()

  return new LogControllerDecorator(
    signUpController,
    mongoLogRepository
  )
}
