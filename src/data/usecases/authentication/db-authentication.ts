import { Authentication, AuthenticationModel } from '../../../domain/usecases/authentication'
import { HashComparer } from '../../protocols/criptography/hash-comparer'
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'

export class DbAuthenticationUseCase implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer
  ) {}

  async auth (credentials: AuthenticationModel): Promise<string | null> {
    const account = await this.loadAccountByEmailRepository.load(credentials.email)

    if (!account) return null

    await this.hashComparer.compare(credentials.password, account.password)
    return null
  }
}
