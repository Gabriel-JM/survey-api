import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'
import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { Hasher } from '../../protocols/criptography/hasher'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository'

export class DbAddAccountUseCase implements AddAccount {
  constructor (
    private readonly encrypter: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    await this.loadAccountByEmailRepository.loadByEmail(accountData.email)

    const hashedPassword = await this.encrypter.hash(accountData.password)

    const account = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    })

    return account
  }
}
