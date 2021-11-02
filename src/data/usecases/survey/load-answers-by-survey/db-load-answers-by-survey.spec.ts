import { mockLoadAnswersBySurveyRepository } from '@/data/_test'
import { DbLoadAnswersBySurveyUsecase } from './db-load-answers-by-survey'

function makeSut () {
  const loadAnswersBySurveyRepositoryStub = mockLoadAnswersBySurveyRepository()

  const sut = new DbLoadAnswersBySurveyUsecase(loadAnswersBySurveyRepositoryStub)

  return {
    sut,
    loadAnswersBySurveyRepositoryStub
  }
}

describe('Db load answers by survey use case', () => {
  it('should call LoadSurveyByIdRepository with correct values', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    await sut.loadAnswers('any_id')

    expect(loadAnswersBySurveyRepositoryStub.loadAnswers).toHaveBeenCalledWith('any_id')
  })

  it('should return empty array if LoadSurveyByIdRepository returns empty array', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    loadAnswersBySurveyRepositoryStub.loadAnswers.mockResolvedValueOnce([])

    const response = await sut.loadAnswers('any_id')

    expect(response).toEqual([])
  })

  it('should return a list of answers on success', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    loadAnswersBySurveyRepositoryStub.loadAnswers.mockResolvedValueOnce([
      'any_answer',
      'other_answer'
    ])

    const answers = await sut.loadAnswers('any_id')

    expect(answers).toEqual([
      'any_answer',
      'other_answer'
    ])
  })

  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositoryStub } = makeSut()
    loadAnswersBySurveyRepositoryStub.loadAnswers.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.loadAnswers('any_id')

    await expect(promise).rejects.toThrowError(Error)
  })
})
