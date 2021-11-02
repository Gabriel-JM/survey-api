import { mockLoadSurveyByIdRepository } from '@/data/_test'
import { mockSurveyModel } from '@/domain/_test'
import { DbLoadAnswersBySurveyUsecase } from './db-load-answers-by-survey'

function makeSut () {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()

  const sut = new DbLoadAnswersBySurveyUsecase(loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('Db load answers by survey use case', () => {
  it('should call LoadSurveyByIdRepository with correct values', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    await sut.loadAnswers('any_id')

    expect(loadSurveyByIdRepositoryStub.loadById).toHaveBeenCalledWith('any_id')
  })

  it('should return empty array if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    loadSurveyByIdRepositoryStub.loadById.mockResolvedValueOnce(null)

    const response = await sut.loadAnswers('any_id')

    expect(response).toEqual([])
  })

  it('should return a list of answers on success', async () => {
    const { sut } = makeSut()
    const fakeSurvey = mockSurveyModel()

    const answers = await sut.loadAnswers('any_id')

    expect(answers).toEqual([
      fakeSurvey.answers[0].answer,
      fakeSurvey.answers[1].answer
    ])
  })

  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    loadSurveyByIdRepositoryStub.loadById.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.loadAnswers('any_id')

    await expect(promise).rejects.toThrowError(Error)
  })
})
