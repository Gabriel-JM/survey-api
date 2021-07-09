import { MongoLogRepository } from './log'

const insertOneStub = jest.fn(/* async () => await Promise.resolve({
  ops: [
    {
      _id: 'valid_id'
    }
  ]
}) */)

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

    getCollection: jest.fn(async () => {
      return await Promise.resolve(collectionStub('errors'))
    }),

    map: jest.fn(() => ({
      id: 'valid_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }))
  }

  return {
    MongoHelper: MongoHelperStub
  }
})

describe('Mongo Log Repository', () => {
  it('should create an error log on success', async () => {
    const sut = new MongoLogRepository()
    await sut.logError('any_error')
    const date = new Date()

    expect(insertOneStub).toHaveBeenCalledWith({
      stack: 'any_error',
      date
    })
  })
})
