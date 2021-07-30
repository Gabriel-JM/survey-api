import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { Encrypter } from '../../protocols/criptography/encrypter'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/account/update-access-token-repository'

export class DbAuthenticationUseCase implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (credentials: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(credentials.email)

    if (!account) return null

    const isEqual = await this.hashComparer.compare(
      credentials.password,
      account.password
    )

    if (!isEqual) return null

    const accessToken = await this.encrypter.encrypt(account.id)

    await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken)

    return accessToken
  }
}
