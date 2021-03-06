import { AddAccountRepository, AddAccountRepositoryResult, AddAccountRespositoryParams } from '@/data/protocols/db/account/add-account-repository'
import { CheckAccountByEmailRepository, CheckAccountByEmailRepositoryResult } from '@/data/protocols/db/account/check-account-by-email-repository'
import { LoadAccountByEmailRepository, LoadAccountByEmailRepositoryResult } from '@/data/protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepository, LoadAccountByTokenRepositoryResult } from '@/data/protocols/db/account/load-account-by-token-repository'
import { UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { MongoHelper } from '../helpers/mongo-helper'

type AccountRepository = AddAccountRepository
& LoadAccountByEmailRepository
& CheckAccountByEmailRepository
& UpdateAccessTokenRepository
& LoadAccountByTokenRepository

export class MongoAccountRepository implements AccountRepository {
  async loadByEmail (email: string): Promise<LoadAccountByEmailRepositoryResult> {
    const accountsCollection = MongoHelper.getCollection('accounts')
    const account = await accountsCollection.findOne(
      { email },
      {
        projection: {
          _id: 1,
          name: 1,
          password: 1
        }
      }
    )

    return account
      ? MongoHelper.map<LoadAccountByEmailRepositoryResult>(account)
      : null
  }

  async checkByEmail (email: string): Promise<CheckAccountByEmailRepositoryResult> {
    const accountsCollection = MongoHelper.getCollection('accounts')
    const account = await accountsCollection.findOne(
      { email },
      {
        projection: {
          _id: 1
        }
      }
    )

    return account !== null
  }

  async loadByToken (token: string, role?: string): Promise<LoadAccountByTokenRepositoryResult> {
    const accountsCollection = MongoHelper.getCollection('accounts')
    const account = await accountsCollection.findOne({
      accessToken: token,
      $or: [{ role }, { role: 'admin' }]
    }, {
      projection: { _id: 1 }
    })

    return account
      ? MongoHelper.map<LoadAccountByTokenRepositoryResult>(account)
      : null
  }

  async add (accountData: AddAccountRespositoryParams): Promise<AddAccountRepositoryResult> {
    const accountsCollection = MongoHelper.getCollection('accounts')
    const operationResult = await accountsCollection.insertOne(accountData)

    const { insertedId } = operationResult

    return insertedId !== null
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountsCollection = MongoHelper.getCollection('accounts')
    await accountsCollection.updateOne({ _id: id }, {
      $set: {
        accessToken: token
      }
    })
  }
}
