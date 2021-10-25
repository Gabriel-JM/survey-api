import { mockLoadSurveyByIdRepository, mockLoadSurveyResultRepository } from '@/data/_test'
import { mockSurveyResultModel } from '@/domain/_test'
import { DbLoadSurveyResultUsecase } from './db-load-survey-result'
import MockDate from 'mockdate'

const fakeDate = new Date()

function makeSut () {
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()

  const sut = new DbLoadSurveyResultUsecase(
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  )

  return {
    sut,
    loadSurveyResultRepositoryStub,
    loadSurveyByIdRepositoryStub
  }
}

describe('Db load survey result use case', () => {
  beforeAll(() => MockDate.set(fakeDate))

  afterAll(() => MockDate.reset())

  it('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    await sut.load('any_id', 'any_account_id')

    expect(loadSurveyResultRepositoryStub.loadBySurveyId)
      .toHaveBeenCalledWith('any_id', 'any_account_id')
  })

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    loadSurveyResultRepositoryStub.loadBySurveyId.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.load('any_id', 'any_account_id')

    await expect(promise).rejects.toThrowError(Error)
  })

  it('should call LoadSurveyByIdRepository if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub, loadSurveyByIdRepositoryStub } = makeSut()
    loadSurveyResultRepositoryStub.loadBySurveyId.mockResolvedValueOnce(null)

    await sut.load('any_id', 'any_account_id')

    expect(loadSurveyByIdRepositoryStub.loadById).toHaveBeenCalledWith('any_id')
  })

  it('should return a surveyResultModel with count 0 if LoadSurveyResultRepository returns null', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    loadSurveyResultRepositoryStub.loadBySurveyId.mockResolvedValueOnce(null)

    const surveyResult = await sut.load('any_id', 'any_account_id')

    const defaultSurveyResultMock = mockSurveyResultModel()

    expect(surveyResult).toEqual({
      ...defaultSurveyResultMock,
      answers: defaultSurveyResultMock.answers.map(answer => ({
        ...answer,
        isCurrentAccountAnswer: false
      }))
    })
  })

  it('should return a surveyResultModel on success', async () => {
    const { sut } = makeSut()
    const response = await sut.load('any_id', 'any_account_id')

    expect(response).toEqual(mockSurveyResultModel(fakeDate))
  })
})
