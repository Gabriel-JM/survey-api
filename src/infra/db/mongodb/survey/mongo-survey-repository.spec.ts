import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel } from '@/domain/_test'
import { make24HexCharsId } from '@/infra/_test'
import { ObjectId } from 'bson'
import { MongoHelper } from '../helpers/mongo-helper'
import { MongoSurveyRepository } from './mongo-survey-repository'

type MongoSurveyModel = Omit<SurveyModel, 'id'> & { _id: string }

const insertOneStub = jest.fn()

const fakeSurvey = mockSurveyModel()

const fakeMongoSurvey = {
  _id: fakeSurvey.id,
  question: fakeSurvey.question,
  answers: fakeSurvey.answers,
  date: fakeSurvey.date
}

const toArrayStub = jest.fn(() => Promise.resolve([fakeMongoSurvey]))
const findOneStub = jest.fn<Promise<MongoSurveyModel|null>, []>(() => Promise.resolve(fakeMongoSurvey))
const aggregateStub = jest.fn(() => ({ toArray: toArrayStub }))

const collectionStub = jest.fn((_name) => ({
  insertOne: insertOneStub,
  find: () => ({ toArray: toArrayStub }),
  findOne: findOneStub,
  aggregate: aggregateStub
}))

const mapSpy = jest.spyOn(MongoHelper, 'map')

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
      return await Promise.resolve(collectionStub('surveys'))
    }),

    map <T = any>(data: any) {
      const { _id, ...dataWithoutId } = data

      return <T> {
        id: _id,
        ...dataWithoutId
      }
    },

    mapCollection <T extends any[] = any[]>(collection: any[]) {
      return collection.map(MongoHelper.map) as T
    }
  }

  return {
    MongoHelper: MongoHelperStub
  }
})

describe('Mongo Survey Repository', () => {
  const fakeSurveyData = {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }, {
      answer: 'any_answer'
    }],
    date: new Date()
  }

  describe('add()', () => {
    it('should add a survey on success', async () => {
      const sut = new MongoSurveyRepository()
      const response = await sut.add(fakeSurveyData)

      expect(collectionStub).toHaveBeenCalledWith('surveys')
      expect(insertOneStub).toHaveBeenCalledWith(fakeSurveyData)
      expect(response).toBeUndefined()
    })
  })

  describe('loadAll()', () => {
    const fakeAccountId = make24HexCharsId()

    it('should load all surveys on success', async () => {
      const sut = new MongoSurveyRepository()
      const response = await sut.loadAll(fakeAccountId)

      expect(collectionStub).toHaveBeenCalledWith('surveys')
      expect(aggregateStub).toHaveBeenCalled()
      expect(response).toEqual([fakeSurvey])
    })

    it('should an empty array if as no surveys in database', async () => {
      const sut = new MongoSurveyRepository()
      toArrayStub.mockResolvedValueOnce([])

      const response = await sut.loadAll(fakeAccountId)

      expect(collectionStub).toHaveBeenCalledWith('surveys')
      expect(response).toEqual([])
    })
  })

  describe('loadById()', () => {
    it('should load survey by id on success', async () => {
      const sut = new MongoSurveyRepository()
      const id = make24HexCharsId()
      const response = await sut.loadById(id)

      expect(findOneStub).toHaveBeenCalledWith({ _id: new ObjectId(id) })
      expect(mapSpy).toHaveBeenCalledWith(fakeMongoSurvey)
      expect(response).toEqual(fakeSurvey)
    })

    it('should return null if no survey was found by the given id', async () => {
      const sut = new MongoSurveyRepository()
      findOneStub.mockResolvedValueOnce(null)

      const id = make24HexCharsId()
      const response = await sut.loadById(id)

      expect(findOneStub).toHaveBeenCalledWith({ _id: new ObjectId(id) })
      expect(mapSpy).toHaveBeenCalledWith(fakeMongoSurvey)
      expect(response).toBeNull()
    })
  })
})
