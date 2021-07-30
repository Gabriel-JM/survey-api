import { MongoAccountRepository } from './mongo-account-repository'

const fakeAccount = {
  id: 'valid_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
}

const insertOneStub = jest.fn(() => Promise.resolve({
  ops: [
    {
      _id: 'valid_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  ]
}))

const findOneStub = jest.fn(() => Promise.resolve({
  _id: 'valid_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})) as jest.Mock<Promise<{
  _id: string
  name: string
  email: string
  password: string
} | null>>

const updateOneStub = jest.fn()

const collectionStub = jest.fn((_name) => ({
  insertOne: insertOneStub,
  findOne: findOneStub,
  updateOne: updateOneStub
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

    getCollection: jest.fn(async () => {
      return await Promise.resolve(collectionStub('accounts'))
    }),

    map: jest.fn(() => fakeAccount)
  }

  return {
    MongoHelper: MongoHelperStub
  }
})

describe('Account Mongo Repository', () => {
  it('should return an account on add success', async () => {
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

    expect(account).toEqual(fakeAccount)
  })

  it('should return an account on loadByEmail success', async () => {
    const sut = new MongoAccountRepository()
    const account = await sut.loadByEmail('any_email@mail.com')

    expect(collectionStub).toHaveBeenCalledWith('accounts')
    expect(findOneStub).toHaveBeenCalledWith({
      email: 'any_email@mail.com'
    })
    expect(account).toEqual(fakeAccount)
  })

  it('should return null if load by email fails', async () => {
    const sut = new MongoAccountRepository()
    findOneStub.mockResolvedValueOnce(null)
    const account = await sut.loadByEmail('any_email@mail.com')

    expect(account).toBeNull()
  })

  it('should update the account accessToken on updateAccessToken success', async () => {
    const sut = new MongoAccountRepository()
    await sut.updateAccessToken('any_id', 'any_token')

    expect(updateOneStub).toHaveBeenCalledWith(
      { _id: 'any_id' },
      {
        $set: {
          accessToken: 'any_token'
        }
      }
    )
  })
})
