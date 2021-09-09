import { MongoSurveyRepository } from './mongo-survey-repository'

const insertOneStub = jest.fn()

const fakeSurvey = {
  _id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
}

const toArrayStub = jest.fn(() => Promise.resolve([fakeSurvey]))

const collectionStub = jest.fn((_name) => ({
  insertOne: insertOneStub,
  find () {
    return {
      toArray: toArrayStub
    }
  }
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
      return await Promise.resolve(collectionStub('surveys'))
    })
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
})
