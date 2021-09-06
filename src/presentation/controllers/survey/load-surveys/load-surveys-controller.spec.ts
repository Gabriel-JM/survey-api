import { LoadSurveysController } from './load-surveys-controller'
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
})
