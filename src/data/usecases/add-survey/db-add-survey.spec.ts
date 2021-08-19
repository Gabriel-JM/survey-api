import { DbAddSurveyUsecase } from './db-add-survey'

function makeSut () {
  const addSurveyRepositoryStub = {
    add: jest.fn()
  }

  const sut = new DbAddSurveyUsecase(addSurveyRepositoryStub)

  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey use case', () => {
  const fakeAddSurveyModel = {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }

  it('should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    await sut.add(fakeAddSurveyModel)

    expect(addSurveyRepositoryStub.add).toHaveBeenCalledWith(fakeAddSurveyModel)
  })

  it('should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()
    addSurveyRepositoryStub.add.mockRejectedValueOnce(new Error())

    const promise = sut.add(fakeAddSurveyModel)

    await expect(promise).rejects.toThrowError(Error)
  })
})
