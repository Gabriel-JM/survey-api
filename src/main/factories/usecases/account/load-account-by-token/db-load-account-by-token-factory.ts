import { DbLoadAccountByTokenUseCase } from '@/data/usecases'
import { JWTAdapter } from '@/infra/cryptografy/jwt/jwt-adapter'
import { MongoAccountRepository } from '@/infra/db/mongodb/account/mongo-account-repository'
import env from '@/main/config/env'

export function makeDbLoadAccountByToken () {
  const accountRepository = new MongoAccountRepository()
  const decrypter = new JWTAdapter(env.jwtSecret)

  const loadAccountByTokenUsecase = new DbLoadAccountByTokenUseCase(
    decrypter,
    accountRepository
  )

  return loadAccountByTokenUsecase
}
