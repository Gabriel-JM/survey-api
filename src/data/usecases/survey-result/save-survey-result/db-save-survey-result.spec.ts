import { DbSaveSurveyResultUsecase } from './db-save-survey-result'
import MockDate from 'mockdate'
import { mockSaveSurveyResultParams, mockSurveyResultModel } from '@/domain/_test'
import { mockSaveSurveyResultRepository } from '@/data/_test'

const fakeDate = new Date()

const fakeSurveyResult = mockSurveyResultModel(fakeDate)

function makeSut () {
  const saveSurveyResultRepositoryStub = mockSaveSurveyResultRepository({
    returnValue: fakeSurveyResult
  })

  const sut = new DbSaveSurveyResultUsecase(saveSurveyResultRepositoryStub)

  return {
    sut,
    saveSurveyResultRepositoryStub
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

  it('should return a survey result on success', async () => {
    const { sut } = makeSut()
    const response = await sut.save(fakeSaveSurveyResultParams)

    expect(response).toEqual(fakeSurveyResult)
  })
})
