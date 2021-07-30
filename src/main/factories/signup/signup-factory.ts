import { DbAddAccountUseCase } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/cryptografy/bcrypt/bcrypt-adapter'
import { MongoAccountRepository } from '../../../infra/db/mongodb/account/mongo-account-repository'
import { MongoLogRepository } from '../../../infra/db/mongodb/log/mongo-log-repository'
import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log/log-controller-decorator'
import { makeSignUpValidation } from './signup-validation-factory'

export function makeSignUpController (): Controller {
  const salt = 12
  const encrypter = new BcryptAdapter(salt)
  const addAccountRepository = new MongoAccountRepository()
  const addAccount = new DbAddAccountUseCase(encrypter, addAccountRepository)

  const validationComposite = makeSignUpValidation()

  const signUpController = new SignUpController(
    addAccount,
    validationComposite
  )

  const mongoLogRepository = new MongoLogRepository()

  return new LogControllerDecorator(
    signUpController,
    mongoLogRepository
  )
}
