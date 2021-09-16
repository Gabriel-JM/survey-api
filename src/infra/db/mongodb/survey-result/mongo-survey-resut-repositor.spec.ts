import { MongoHelper } from '../helpers/mongo-helper'
import MockDate from 'mockdate'
import { MongoSurveyResultRepository } from './mongo-survey-result-repository'
import { Collection } from 'mongodb'

const fakeDate = new Date()

const fakeSurveyResult = {
  id: 'any_id',
  surveyId: 'any_id',
  accountId: 'any_id',
  answer: 'any_answer',
  date: fakeDate
}

const fakeMongoSurveyResult = {
  _id: 'any_id',
  surveyId: fakeSurveyResult.surveyId,
  accountId: fakeSurveyResult.accountId,
  answer: fakeSurveyResult.answer,
  date: fakeSurveyResult.date
}

const findOneAndUpdateStub = jest.fn(() => Promise.resolve({
  value: fakeMongoSurveyResult
}))

const getCollectionSpy = jest.spyOn(MongoHelper, 'getCollection')
getCollectionSpy.mockImplementation(() => {
  return Promise.resolve({
    findOneAndUpdate: findOneAndUpdateStub
  }) as unknown as Promise<Collection>
})

const mapSpy = jest.spyOn(MongoHelper, 'map')

describe('Mongo survey result repository', () => {
  beforeAll(() => MockDate.set(fakeDate))

  afterAll(() => MockDate.reset())

  describe('save()', () => {
    it('should update a survey result', async () => {
      const sut = new MongoSurveyResultRepository()
      const surveyResult = await sut.save({
        surveyId: 'any_id',
        accountId: 'any_id',
        answer: 'any_answer',
        date: fakeDate
      })

      const findOneAndUpdateExpectedParams = [
        {
          surveyId: 'any_id',
          accountId: 'any_id'
        }, {
          $set: {
            answer: 'any_answer',
            date: fakeDate
          }
        },
        { upsert: true, returnDocument: 'after' }
      ]

      expect(getCollectionSpy).toHaveBeenCalledWith('surveyResults')
      expect(findOneAndUpdateStub).toHaveBeenCalledWith(...findOneAndUpdateExpectedParams)
      expect(mapSpy).toHaveBeenCalledWith(fakeMongoSurveyResult)
      expect(surveyResult).toEqual(fakeSurveyResult)
    })
  })
})
