import { LoadSurveysController } from './load-surveys-controller'
import { ok, serverError } from '../../../helpers/http/http-helper'
import MockDate from 'mockdate'

const date = new Date()

const fakeSurveys = [{
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date
}, {
  id: 'other_id',
  question: 'other_question',
  answers: [{
    image: 'other_image',
    answer: 'other_answer'
  }],
  date
}]

function makeSut () {
  const loadSurveysStub = {
    load: jest.fn(() => Promise.resolve(fakeSurveys))
  }

  const sut = new LoadSurveysController(loadSurveysStub)

  return {
    sut,
    loadSurveysStub
  }
}

describe('Load Surveys Controller', () => {
  beforeAll(() => MockDate.set(date))

  afterAll(() => MockDate.reset())

  it('should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()
    await sut.handle({})

    expect(loadSurveysStub.load).toHaveBeenCalledWith()
  })

  it('should return 200 on success', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})

    expect(response).toEqual(ok(fakeSurveys))
  })

  it('should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()
    loadSurveysStub.load.mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await sut.handle({})

    expect(response).toEqual(serverError(new Error()))
  })
})
