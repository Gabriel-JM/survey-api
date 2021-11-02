import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { SaveSurveyResultController } from './save-survey-result-controller'
import MockDate from 'mockdate'
import { mockSurveyResultModel } from '@/domain/_test'
import { mockSaveSurveyResult, mockLoadAnswersBySurvey } from '@/presentation/_test'

const fakeDate = new Date()

const fakeSurveyResult = mockSurveyResultModel(fakeDate)

function makeSut () {
  const saveSurveyResultStub = mockSaveSurveyResult({ returnValue: fakeSurveyResult })
  const loadAnswersBySurveyStub = mockLoadAnswersBySurvey()

  const sut = new SaveSurveyResultController(loadAnswersBySurveyStub, saveSurveyResultStub)

  return {
    sut,
    loadAnswersBySurveyStub,
    saveSurveyResultStub
  }
}

describe('Save survey result controller', () => {
  const fakeRequest = {
    accountId: 'any_account_id',
    surveyId: 'any_id',
    answer: 'any_answer'
  }

  beforeAll(() => MockDate.set(fakeDate))

  afterAll(() => MockDate.reset())

  it('should call LoadAnswersBySurvey with correct values', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    await sut.handle(fakeRequest)

    expect(loadAnswersBySurveyStub.loadAnswers).toHaveBeenCalledWith('any_id')
  })

  it('should return 403 if LoadAnswersBySurvey returns an empty array', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    loadAnswersBySurveyStub.loadAnswers.mockResolvedValueOnce([])
    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('should return 500 if LoadAnswersBySurvey throws', async () => {
    const { sut, loadAnswersBySurveyStub } = makeSut()
    loadAnswersBySurveyStub.loadAnswers.mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({
      surveyId: '',
      accountId: '',
      answer: 'wrong_answer'
    })

    expect(response).toEqual(forbidden(new InvalidParamError('answer')))
  })

  it('should call SaveSurveyResult with correct values', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    await sut.handle(fakeRequest)

    expect(saveSurveyResultStub.save).toHaveBeenCalledWith({
      surveyId: 'any_id',
      accountId: 'any_account_id',
      answer: 'any_answer',
      date: fakeDate
    })
  })

  it('should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()
    saveSurveyResultStub.save.mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(ok(fakeSurveyResult))
  })
})
