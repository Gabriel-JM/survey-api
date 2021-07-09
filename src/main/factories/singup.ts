import { DbAddAccountUseCase } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/cryptografy/bcrypt-adapter'
import { MongoAccountRepository } from '../../infra/db/mongodb/account-repository/account'
import { MongoLogRepository } from '../../infra/db/mongodb/log-repository/log'
import { SignUpController } from '../../presentation/controllers/signup/signup'
import { Controller } from '../../presentation/protocols'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../decorators/log'

export function makeSignUpController (): Controller {
  const emailValidator = new EmailValidatorAdapter()

  const salt = 12
  const encrypter = new BcryptAdapter(salt)
  const addAccountRepository = new MongoAccountRepository()
  const addAccount = new DbAddAccountUseCase(encrypter, addAccountRepository)

  const signUpController = new SignUpController(emailValidator, addAccount)

  const mongoLogRepository = new MongoLogRepository()

  return new LogControllerDecorator(
    signUpController,
    mongoLogRepository
  )
}
