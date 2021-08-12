import { DbAddAccountUseCase } from '../../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../../infra/cryptografy/bcrypt/bcrypt-adapter'
import { MongoAccountRepository } from '../../../../infra/db/mongodb/account/mongo-account-repository'

export function makeDbAddAccount () {
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  const addAccountRepository = new MongoAccountRepository()
  const addAccount = new DbAddAccountUseCase(hasher, addAccountRepository)

  return addAccount
}
