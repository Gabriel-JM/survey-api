import { mockSurveyResultModel } from '@/domain/_test'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { mockCheckSurveyById, mockLoadSurveyResult } from '@/presentation/_test'
import { LoadSurveyResultController } from './load-survey-result-controller'

const fakeDate = new Date()

function makeSut () {
  const checkSurveyByIdStub = mockCheckSurveyById()

  const loadSurveyResultStub = mockLoadSurveyResult({
    fakeDate
  })

  const sut = new LoadSurveyResultController(checkSurveyByIdStub, loadSurveyResultStub)

  return {
    sut,
    checkSurveyByIdStub,
    loadSurveyResultStub
  }
}

describe('LoadSurveyResultController', () => {
  const fakeRequest = {
    surveyId: 'any_id',
    accountId: 'any_account_id'
  }

  it('should call CheckSurveyById with correct value', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    await sut.handle(fakeRequest)

    expect(checkSurveyByIdStub.checkById).toHaveBeenCalledWith(fakeRequest.surveyId)
  })

  it('should return 403 if CheckSurveyById returns false', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    checkSurveyByIdStub.checkById.mockResolvedValueOnce(false)

    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('shoudl return 500 if CheckSurveyById throws', async () => {
    const { sut, checkSurveyByIdStub } = makeSut()
    checkSurveyByIdStub.checkById.mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    await sut.handle(fakeRequest)

    expect(loadSurveyResultStub.load).toHaveBeenCalledWith(
      fakeRequest.surveyId,
      fakeRequest.accountId
    )
  })

  it('shoudl return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    loadSurveyResultStub.load.mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(ok(mockSurveyResultModel(fakeDate)))
  })
})
