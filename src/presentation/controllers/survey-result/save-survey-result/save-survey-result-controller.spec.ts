import { SurveyModel } from '@/domain/models/survey'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { SaveSurveyResultController } from './save-survey-result-controller'
import MockDate from 'mockdate'
import { mockSurveyModel } from '@/domain/_test'

const fakeDate = new Date()

const fakeSurvey = mockSurveyModel()

const fakeSurveyResult = {
  id: 'any_id',
  surveyId: 'any_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: fakeDate
}

function makeSut () {
  const saveSurveyResultStub = {
    save: jest.fn(() => Promise.resolve(fakeSurveyResult))
  }

  const loadSurveyByIdStub = {
    loadById: jest.fn<Promise<SurveyModel|null>, []>(() => Promise.resolve(fakeSurvey))
  }

  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)

  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('Save survey result controller', () => {
  const fakeRequest = {
    accountId: 'any_account_id',
    params: {
      surveyId: 'any_id'
    },
    body: {
      answer: 'any_answer'
    }
  }

  beforeAll(() => MockDate.set(fakeDate))

  afterAll(() => MockDate.reset())

  it('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    await sut.handle(fakeRequest)

    expect(loadSurveyByIdStub.loadById).toHaveBeenCalledWith('any_id')
  })

  it('should return 403 if LoadSurveyById returns null', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    loadSurveyByIdStub.loadById.mockResolvedValueOnce(null)
    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })

  it('should return 500 if LoadSurveyById throws', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    loadSurveyByIdStub.loadById.mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await sut.handle(fakeRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should return 403 if an invalid answer is provided', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({
      params: {},
      body: {
        answer: 'wrong_answer'
      }
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
