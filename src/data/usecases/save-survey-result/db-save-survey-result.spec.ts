import { DbSaveSurveyResultUsecase } from './db-save-survey-result'
import MockDate from 'mockdate'

const fakeDate = new Date()

const fakeSurveyResult = {
  id: 'any_id',
  surveyId: 'any_id',
  accountId: 'any_id',
  answer: 'any_answer',
  date: fakeDate
}

function makeSut () {
  const saveSurveyResultRepositoryStub = {
    save: jest.fn(() => Promise.resolve(fakeSurveyResult))
  }

  const sut = new DbSaveSurveyResultUsecase(saveSurveyResultRepositoryStub)

  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('Db save survey result use case', () => {
  const fakeParams = {
    surveyId: 'any_id',
    accountId: 'any_id',
    answer: 'any_answer',
    date: fakeDate
  }

  beforeAll(() => MockDate.set(fakeDate))

  afterAll(() => MockDate.reset())

  it('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    await sut.save(fakeParams)

    expect(saveSurveyResultRepositoryStub.save).toHaveBeenCalledWith(fakeParams)
  })
})
