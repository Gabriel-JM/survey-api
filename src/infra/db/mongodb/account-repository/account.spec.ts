import { MongoAccountRepository } from './account'

const insertOneStub = jest.fn(async () => await Promise.resolve({
  ops: [
    {
      _id: 'valid_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  ]
}))

const collectionStub = jest.fn((_name) => ({
  insertOne: insertOneStub
}))

jest.mock('../helpers/mongo-helper', () => {
  const MongoHelperStub = {
    client: jest.fn(() => ({
      db () {
        return {
          collection: collectionStub
        }
      }
    })),

    connect: jest.fn(),

    getCollection: jest.fn(() => {
      return collectionStub('accounts')
    })
  }

  return {
    MongoHelper: MongoHelperStub
  }
})

describe('Account Mongo Repository', () => {
  it('should return an account on success', async () => {
    const sut = new MongoAccountRepository()
    const account = await sut.add({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(collectionStub).toHaveBeenCalledWith('accounts')
    expect(insertOneStub).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })

    expect(account).toEqual({
      id: 'valid_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })
})
