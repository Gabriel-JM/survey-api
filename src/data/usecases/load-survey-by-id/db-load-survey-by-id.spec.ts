import MockDate from 'mockdate'
import { DbLoadSurveyByIdUsecase } from './db-load-survey-by-id'

const fakeDate = new Date()

const fakeSurvey = {
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: fakeDate
}

function makeSut () {
  const loadSurveyByIdRepositoryStub = {
    loadById: jest.fn(() => Promise.resolve(fakeSurvey))
  }

  const sut = new DbLoadSurveyByIdUsecase(loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('Db load survey by id use case', () => {
  beforeAll(() => MockDate.set(fakeDate))

  afterAll(() => MockDate.reset())

  it('should call LoadSurveyByIdRepository with correct values', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    await sut.loadById('any_id')

    expect(loadSurveyByIdRepositoryStub.loadById).toHaveBeenCalledWith('any_id')
  })

  it('should return a survey on success', async () => {
    const { sut } = makeSut()
    const response = await sut.loadById('any_id')

    expect(response).toEqual(fakeSurvey)
  })
})
