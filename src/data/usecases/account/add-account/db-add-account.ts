import { AddAccount, AddAccountParams, AddAccountResult } from '@/domain/usecases'
import { AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { Hasher } from '@/data/protocols/criptography/hasher'
import { CheckAccountByEmailRepository } from '@/data/protocols/db/account/check-account-by-email-repository'

export class DbAddAccountUseCase implements AddAccount {
  constructor (
    private readonly encrypter: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly checkAccountByEmailRepository: CheckAccountByEmailRepository
  ) { }

  async add (accountData: AddAccountParams): Promise<AddAccountResult> {
    const hasAccount = await this.checkAccountByEmailRepository.checkByEmail(accountData.email)

    if (hasAccount) return false

    const hashedPassword = await this.encrypter.hash(accountData.password)

    const isValid = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    })

    return isValid
  }
}
