import { MongoAccountRepository } from './mongo-account-repository'
import { MongoHelper } from '../helpers/mongo-helper'

const fakeMongoAccount = {
  id: 'valid_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  accessToken: 'any_token'
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

const findOneStub = (jest.fn(() => Promise.resolve({
  _id: 'valid_id',
  name: 'any_name',
  password: 'any_password'
})) as jest.Mock<unknown | null>)

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

    getCollection: jest.fn(async (collectionName) => {
      return await Promise.resolve(collectionStub(collectionName))
    }),

    map: jest.fn(() => fakeMongoAccount)
  }

  return {
    MongoHelper: MongoHelperStub
  }
})

describe('Account Mongo Repository', () => {
  describe('add()', () => {
    it('should return an account on add success', async () => {
      const sut = new MongoAccountRepository()
      const isValid = await sut.add({
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

      expect(isValid).toEqual(true)
    })
  })

  describe('loadByEmail()', () => {
    it('should return an account on loadByEmail success', async () => {
      const sut = new MongoAccountRepository()
      const account = await sut.loadByEmail('any_email@mail.com')

      expect(collectionStub).toHaveBeenCalledWith('accounts')
      expect(findOneStub).toHaveBeenCalledWith(
        { email: 'any_email@mail.com' },
        {
          projection: {
            _id: 1,
            name: 1,
            password: 1
          }
        }
      )
      expect(account).toEqual(fakeMongoAccount)
    })

    it('should return null if load by email fails', async () => {
      const sut = new MongoAccountRepository()
      findOneStub.mockResolvedValueOnce(null as unknown as never)
      const account = await sut.loadByEmail('any_email@mail.com')

      expect(account).toBeNull()
    })
  })

  describe('checkByEmail()', () => {
    it('should return an account on checkByEmail success', async () => {
      const sut = new MongoAccountRepository()
      const hasAccount = await sut.checkByEmail('any_email@mail.com')

      expect(collectionStub).toHaveBeenCalledWith('accounts')
      expect(findOneStub).toHaveBeenCalledWith(
        { email: 'any_email@mail.com' },
        {
          projection: {
            _id: 1
          }
        }
      )
      expect(hasAccount).toBe(true)
    })

    it('should return false if load by email fails', async () => {
      const sut = new MongoAccountRepository()
      findOneStub.mockResolvedValueOnce(null as unknown as never)
      const hasAccount = await sut.checkByEmail('any_email@mail.com')

      expect(hasAccount).toBe(false)
    })
  })

  describe('updateAccessToken()', () => {
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

  describe('loadByToken()', () => {
    it('should return an account on loadByToken without role', async () => {
      const sut = new MongoAccountRepository()
      const account = await sut.loadByToken('any_token')

      expect(collectionStub).toHaveBeenCalledWith('accounts')
      expect(findOneStub).toHaveBeenCalledWith({
        accessToken: 'any_token',
        $or: [{ role: undefined }, { role: 'admin' }]
      }, { projection: { _id: 1 } })
      expect(account).toEqual(fakeMongoAccount)
    })

    it('should return an account on loadByToken with role', async () => {
      const sut = new MongoAccountRepository()
      const account = await sut.loadByToken('any_token', 'admin')

      expect(collectionStub).toHaveBeenCalledWith('accounts')
      expect(findOneStub).toHaveBeenCalledWith({
        accessToken: 'any_token',
        $or: [{ role: 'admin' }, { role: 'admin' }]
      }, { projection: { _id: 1 } })
      expect(account).toEqual(fakeMongoAccount)
    })

    it('should return null on loadByToken with invalid role', async () => {
      const sut = new MongoAccountRepository()
      jest.spyOn(MongoHelper, 'map').mockImplementationOnce(({ role }) => {
        if (role !== 'admin') {
          return null
        }

        return fakeMongoAccount
      })
      const account = await sut.loadByToken('any_token', 'admin')

      expect(collectionStub).toHaveBeenCalledWith('accounts')
      expect(findOneStub).toHaveBeenCalledWith({
        accessToken: 'any_token',
        $or: [{ role: undefined }, { role: 'admin' }]
      }, { projection: { _id: 1 } })
      expect(account).toEqual(null)
    })

    it('should return null if load by token fails', async () => {
      const sut = new MongoAccountRepository()
      findOneStub.mockResolvedValueOnce(null as unknown as never)
      const account = await sut.loadByToken('any_token')

      expect(account).toBeNull()
    })
  })
})
