import { MongoSurveyRepository } from './mongo-survey-repository'

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
    }]
  }

  it('should add a survey on success', async () => {
    const sut = new MongoSurveyRepository()
    const response = await sut.add(fakeSurveyData)

    expect(collectionStub).toHaveBeenCalledWith('surveys')
    expect(insertOneStub).toHaveBeenCalledWith(fakeSurveyData)
    expect(response).toBeUndefined()
  })
})
