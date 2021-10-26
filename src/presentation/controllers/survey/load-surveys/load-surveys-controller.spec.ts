import { LoadSurveysController } from './load-surveys-controller'
import { noContent, ok, serverError } from '../../../helpers/http/http-helper'
import MockDate from 'mockdate'
import { mockSurveyModel } from '@/domain/_test'
import { mockLoadSurveys } from '@/presentation/_test'

const date = new Date()

const fakeSurveys = [mockSurveyModel(date), mockSurveyModel(date)]

const mockRequestParams = () => ({
  accountId: 'any_account_id'
})

function makeSut () {
  const loadSurveysStub = mockLoadSurveys({ returnValue: fakeSurveys })

  const sut = new LoadSurveysController(loadSurveysStub)

  return {
    sut,
    loadSurveysStub
  }
}

describe('Load Surveys Controller', () => {
  beforeAll(() => MockDate.set(date))

  afterAll(() => MockDate.reset())

  it('should call LoadSurveys with correct value', async () => {
    const { sut, loadSurveysStub } = makeSut()
    const request = mockRequestParams()
    await sut.handle(request)

    expect(loadSurveysStub.load).toHaveBeenCalledWith(request.accountId)
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(mockRequestParams())

    expect(response).toEqual(ok(fakeSurveys))
  })

  it('should return 204 if LoadSurveys returns an empty list', async () => {
    const { sut, loadSurveysStub } = makeSut()
    loadSurveysStub.load.mockResolvedValueOnce([])
    const response = await sut.handle(mockRequestParams())

    expect(response).toEqual(noContent())
  })

  it('should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    loadSurveysStub.load.mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await sut.handle(mockRequestParams())

    expect(response).toEqual(serverError(new Error()))
  })
})
