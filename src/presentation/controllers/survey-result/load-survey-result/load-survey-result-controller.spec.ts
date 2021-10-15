import { mockSurveyModel } from '@/domain/_test'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { mockLoadSurveyById, mockLoadSurveyResult } from '@/presentation/_test'
import { LoadSurveyResultController } from './load-survey-result-controller'

function makeSut () {
  const loadSurveyByIdStub = mockLoadSurveyById({
    returnValue: mockSurveyModel()
  })

  const loadSurveyResultStub = mockLoadSurveyResult()

  const sut = new LoadSurveyResultController(loadSurveyByIdStub, loadSurveyResultStub)

  return {
    sut,
    loadSurveyByIdStub,
    loadSurveyResultStub
  }
}

describe('LoadSurveyResultController', () => {
  const fakeRequest = {
    params: {
      surveyId: 'any_id'
    }
  }

  it('should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    await sut.handle(fakeRequest)

    expect(loadSurveyByIdStub.loadById).toHaveBeenCalledWith(fakeRequest.params.surveyId)
  })

  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    loadSurveyByIdStub.loadById.mockResolvedValueOnce(null)

    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('shoudl return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    loadSurveyByIdStub.loadById.mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should call LoadSurveyResult with correct values', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    await sut.handle(fakeRequest)

    expect(loadSurveyResultStub.load).toHaveBeenCalledWith(fakeRequest.params.surveyId)
  })

  it('shoudl return 500 if LoadSurveyResult throws', async () => {
    const { sut, loadSurveyResultStub } = makeSut()
    loadSurveyResultStub.load.mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(serverError(new Error()))
  })
})
