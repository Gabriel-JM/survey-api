import { ObjectId } from 'bson'
import { MongoHelper } from '../helpers/mongo-helper'
import { MongoSurveyRepository } from './mongo-survey-repository'

const insertOneStub = jest.fn()

const fakeSurvey = {
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
}

const fakeMongoSurvey = {
  _id: fakeSurvey.id,
  question: fakeSurvey.question,
  answers: fakeSurvey.answers,
  date: fakeSurvey.date
}

const toArrayStub = jest.fn(() => Promise.resolve([fakeMongoSurvey]))

const findOneStub = jest.fn(() => Promise.resolve(fakeMongoSurvey))

const collectionStub = jest.fn((_name) => ({
  insertOne: insertOneStub,
  find () {
    return {
      toArray: toArrayStub
    }
  },
  findOne: findOneStub
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
    it('should load all surveys on success', async () => {
      const sut = new MongoSurveyRepository()
      const response = await sut.loadAll()

      expect(collectionStub).toHaveBeenCalledWith('surveys')
      expect(response).toEqual([fakeSurvey])
    })
  })

  describe('loadById()', () => {
    const randomHex = () => Math.random().toString(16).substr(2)

    function make24HexCharsId () {
      const str = `${randomHex()}${randomHex()}`

      return str.length > 24 ? str.substring(0, 24) : str
    }

    it('should load survey by id on success', async () => {
      const sut = new MongoSurveyRepository()
      const id = make24HexCharsId()
      const response = await sut.loadById(id)

      expect(findOneStub).toHaveBeenCalledWith({ _id: new ObjectId(id) })
      expect(mapSpy).toHaveBeenCalledWith(fakeMongoSurvey)
      expect(response).toEqual(fakeSurvey)
    })
  })
})
