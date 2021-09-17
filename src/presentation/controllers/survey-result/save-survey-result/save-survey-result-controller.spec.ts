import { SaveSurveyResultController } from './save-survey-result-controller'

const fakeSurvey = {
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
}

function makeSut () {
  const loadSurveyByIdStub = {
    loadById: jest.fn(() => Promise.resolve(fakeSurvey))
  }

  const sut = new SaveSurveyResultController(loadSurveyByIdStub)

  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('Save survey result controller', () => {
  const fakeRequest = {
    params: {
      surveyId: 'any_id'
    }
  }

  it('should call LoadSurveyById with correct values', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    await sut.handle(fakeRequest)

    expect(loadSurveyByIdStub.loadById).toHaveBeenCalledWith('any_id')
  })
})
