import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthenticationUseCase implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth (credentials: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(credentials.email)

    if (!account) return null

    const isEqual = await this.hashComparer.compare(
      credentials.password,
      account.password
    )

    if (!isEqual) return null

    const accessToken = await this.tokenGenerator.generate(account.id)
    return accessToken
  }
}
