import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class MongoAccountRepository implements AddAccountRepository, LoadAccountByEmailRepository {
  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const account = await accountsCollection.findOne({ email })

    return account
      ? MongoHelper.map<AccountModel>(account)
      : null
  }

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const operationResult = await accountsCollection.insertOne(accountData)

    const [account] = operationResult.ops

    return MongoHelper.map<AccountModel>(account)
  }
}
