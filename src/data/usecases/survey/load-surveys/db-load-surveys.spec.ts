import { mockLoadSurveysRepository } from '@/data/_test'
import { mockSurveyModel } from '@/domain/_test'
import { DbLoadSurveysUseCase } from './db-load-surveys'

const fakeSurveys = [mockSurveyModel(), mockSurveyModel()]

function makeSut () {
  const loadSurveysRepositoryStub = mockLoadSurveysRepository({
    returnValue: fakeSurveys
  })

  const sut = new DbLoadSurveysUseCase(loadSurveysRepositoryStub)

  return {
    sut,
    loadSurveysRepositoryStub
  }
}

describe('Db load surveys use case', () => {
  const accountId = 'any_account_id'

  it('should call LoadSurveysRepository with correct values', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    await sut.load(accountId)

    expect(loadSurveysRepositoryStub.loadAll).toHaveBeenCalledWith(accountId)
  })

  it('should return surveys on success', async () => {
    const { sut } = makeSut()
    const response = await sut.load(accountId)

    expect(response).toEqual(fakeSurveys)
  })

  it('should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    loadSurveysRepositoryStub.loadAll.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.load(accountId)

    await expect(promise).rejects.toThrowError(Error)
  })
})
