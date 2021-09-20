import { SurveyModel } from '@/domain/models/survey'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, serverError } from '@/presentation/helpers/http/http-helper'
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
    loadById: jest.fn<Promise<SurveyModel|null>, []>(() => Promise.resolve(fakeSurvey))
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
    },
    body: {
      answer: 'any_answer'
    }
  }

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
      body: {
        answer: 'wrong_answer'
      }
    })

    expect(response).toEqual(forbidden(new InvalidParamError('answer')))
  })
})
