import { DbLoadSurveysUseCase } from './db-load-surveys'

const fakeSurveys = [{
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
}, {
  id: 'other_id',
  question: 'other_question',
  answers: [{
    image: 'other_image',
    answer: 'other_answer'
  }],
  date: new Date()
}]

function makeSut () {
  const loadSurveysRepositoryStub = {
    loadAll: jest.fn(() => Promise.resolve(fakeSurveys))
  }

  const sut = new DbLoadSurveysUseCase(loadSurveysRepositoryStub)

  return {
    sut,
    loadSurveysRepositoryStub
  }
}

describe('Db load surveys use case', () => {
  it('should call LoadSurveysRepository with correct values', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    await sut.load()

    expect(loadSurveysRepositoryStub.loadAll).toHaveBeenCalledWith()
  })

  it('should return surveys on success', async () => {
    const { sut } = makeSut()
    const response = await sut.load()

    expect(response).toEqual(fakeSurveys)
  })
})
