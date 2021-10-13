import { mockSurveyResultModel } from '@/domain/_test'
import { DbLoadSurveyResultUsecase } from './db-load-survey-result'

function makeSut () {
  const loadSurveyResultRepositoryStub = {
    loadBySurveyId: jest.fn(() => Promise.resolve(mockSurveyResultModel()))
  }

  const sut = new DbLoadSurveyResultUsecase(loadSurveyResultRepositoryStub)

  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}

describe('Db load survey result use case', () => {
  it('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    await sut.load('any_id')

    expect(loadSurveyResultRepositoryStub.loadBySurveyId).toHaveBeenCalledWith('any_id')
  })
})
