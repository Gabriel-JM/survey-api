import { MongoLogRepository } from './mongo-log-repository'
import MockDate from 'mockdate'

const insertOneStub = jest.fn()

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
  const date = new Date()

  beforeAll(() => MockDate.set(date))

  afterAll(() => MockDate.reset())

  it('should create an error log on success', async () => {
    const sut = new MongoLogRepository()
    await sut.logError('any_error')

    expect(insertOneStub).toHaveBeenCalledWith({
      stack: 'any_error',
      date
    })
  })
})
