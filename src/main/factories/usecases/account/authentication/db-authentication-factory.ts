import { DbAuthenticationUseCase } from '../../../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../../../infra/cryptografy/bcrypt/bcrypt-adapter'
import { JWTAdapter } from '../../../../../infra/cryptografy/jwt/jwt-adapter'
import { MongoAccountRepository } from '../../../../../infra/db/mongodb/account/mongo-account-repository'
import env from '../../../../config/env'

export function makeDbAuthentication () {
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

  return authentication
}
