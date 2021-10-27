import { LoadAccountByToken, LoadAccountByTokenResult } from '@/domain/usecases'
import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'

export class DbLoadAccountByTokenUseCase implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<LoadAccountByTokenResult> {
    let token: string | null

    try {
      token = await this.decrypter.decrypt(accessToken)
    } catch {
      return null
    }

    if (!token) return null

    const account = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)

    if (!account) return null

    return account
  }
}
