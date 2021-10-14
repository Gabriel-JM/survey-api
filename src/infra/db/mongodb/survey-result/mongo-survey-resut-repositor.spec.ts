import { MongoHelper } from '../helpers/mongo-helper'
import MockDate from 'mockdate'
import { MongoSurveyResultRepository } from './mongo-survey-result-repository'
import { Collection, ObjectId } from 'mongodb'
import { make24HexCharsId } from '@/infra/_test'

const fakeDate = new Date()

const fakeSurveyResult = {
  surveyId: 'any_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    count: 1,
    percent: 50
  }],
  date: fakeDate
}

const fakeMongoSurveyResult = {
  _id: 'any_id',
  surveyId: fakeSurveyResult.surveyId,
  question: fakeSurveyResult.question,
  answers: fakeSurveyResult.answers,
  date: fakeSurveyResult.date
}

const findOneAndUpdateStub = jest.fn(() => Promise.resolve({
  value: fakeMongoSurveyResult
}))

const toArrayStub = jest.fn(() => Promise.resolve([fakeSurveyResult]))

const getCollectionSpy = jest.spyOn(MongoHelper, 'getCollection')
getCollectionSpy.mockImplementation(() => {
  return Promise.resolve({
    findOneAndUpdate: findOneAndUpdateStub,
    aggregate: () => ({ toArray: toArrayStub })
  }) as unknown as Promise<Collection>
})

describe('Mongo survey result repository', () => {
  beforeAll(() => MockDate.set(fakeDate))

  afterAll(() => MockDate.reset())

  describe('save()', () => {
    it('should update a survey result', async () => {
      const sut = new MongoSurveyResultRepository()
      const saveSurveyResultParams = {
        surveyId: make24HexCharsId(),
        accountId: make24HexCharsId(),
        answer: 'any_answer',
        date: fakeDate
      }

      const surveyResult = await sut.save(saveSurveyResultParams)

      const findOneAndUpdateExpectedParams = [
        {
          surveyId: new ObjectId(saveSurveyResultParams.surveyId),
          accountId: new ObjectId(saveSurveyResultParams.accountId)
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
      expect(toArrayStub).not.toHaveBeenCalled()
      expect(surveyResult).toBeUndefined()
    })
  })

  describe('loadBySurveyId()', () => {
    it('should load survey result by the given survey id', async () => {
      const sut = new MongoSurveyResultRepository()
      const surveyId = make24HexCharsId()
      const surveyResult = await sut.loadBySurveyId(surveyId)

      expect(getCollectionSpy).toHaveBeenCalledWith('surveyResults')
      expect(toArrayStub).toHaveBeenCalled()
      expect(surveyResult).toEqual(fakeSurveyResult)
    })

    it('should return if no survey result was found', async () => {
      const sut = new MongoSurveyResultRepository()
      const surveyId = make24HexCharsId()
      toArrayStub.mockResolvedValueOnce([])

      const surveyResult = await sut.loadBySurveyId(surveyId)

      expect(getCollectionSpy).toHaveBeenCalledWith('surveyResults')
      expect(toArrayStub).toHaveBeenCalled()
      expect(surveyResult).toBeNull()
    })
  })
})
