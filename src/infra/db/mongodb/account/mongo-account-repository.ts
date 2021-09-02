import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository } from '../../../../data/protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

type AccountRepository = AddAccountRepository
& LoadAccountByEmailRepository
& UpdateAccessTokenRepository
& LoadAccountByTokenRepository

export class MongoAccountRepository implements AccountRepository {
  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const account = await accountsCollection.findOne({ email })

    return account
      ? MongoHelper.map<AccountModel>(account)
      : null
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel | null> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    const account = await accountsCollection.findOne({
      accessToken: token,
      $or: [{ role }, { role: 'admin' }]
    })

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

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountsCollection = await MongoHelper.getCollection('accounts')
    await accountsCollection.updateOne({ _id: id }, {
      $set: {
        accessToken: token
      }
    })
  }
}
