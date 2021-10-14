import { DbSaveSurveyResultUsecase } from './db-save-survey-result'
import MockDate from 'mockdate'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/domain/_test'
import { mockLoadSurveyResultRepository, mockSaveSurveyResultRepository } from '@/data/_test'

const fakeDate = new Date()

const fakeSurveyResult = mockSurveyResultModel(fakeDate)

function makeSut () {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository()
  const loadSurveyResultRepositoryStub = mockLoadSurveyResultRepository()

  const sut = new DbSaveSurveyResultUsecase(
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  )

  return {
    sut,
    saveSurveyResultRepositoryStub,
    loadSurveyResultRepositoryStub
  }
}

describe('Db save survey result use case', () => {
  const fakeSaveSurveyResultParams = mockSaveSurveyResultParams(fakeDate)

  beforeAll(() => MockDate.set(fakeDate))

  afterAll(() => MockDate.reset())

  it('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    await sut.save(fakeSaveSurveyResultParams)

    expect(saveSurveyResultRepositoryStub.save).toHaveBeenCalledWith(fakeSaveSurveyResultParams)
  })

  it('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()
    saveSurveyResultRepositoryStub.save.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.save(fakeSaveSurveyResultParams)

    await expect(promise).rejects.toThrowError(Error)
  })

  it('should call LoadSurveyResultRepository with correct values', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    await sut.save(fakeSaveSurveyResultParams)

    expect(loadSurveyResultRepositoryStub.loadBySurveyId)
      .toHaveBeenCalledWith(fakeSaveSurveyResultParams.surveyId)
  })

  it('should throw if LoadSurveyResultRepository throws', async () => {
    const { sut, loadSurveyResultRepositoryStub } = makeSut()
    loadSurveyResultRepositoryStub.loadBySurveyId.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.save(fakeSaveSurveyResultParams)

    await expect(promise).rejects.toThrowError(Error)
  })

  it('should return a survey result on success', async () => {
    const { sut } = makeSut()
    const response = await sut.save(fakeSaveSurveyResultParams)

    expect(response).toEqual(fakeSurveyResult)
  })
})
