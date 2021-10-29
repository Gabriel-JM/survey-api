import { AddAccount, AddAccountParams, AddAccountResult } from '@/domain/usecases'
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { Hasher } from '@/data/protocols/criptography/hasher'
import { LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'

export class DbAddAccountUseCase implements AddAccount {
  constructor (
    private readonly encrypter: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) { }

  async add (accountData: AddAccountParams): Promise<AddAccountResult> {
    const inDbAccount = await this.loadAccountByEmailRepository.loadByEmail(accountData.email)

    if (inDbAccount) return false

    const hashedPassword = await this.encrypter.hash(accountData.password)

    const isValid = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    })

    return isValid
  }
}
