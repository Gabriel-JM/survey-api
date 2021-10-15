import { mockSurveyModel } from '@/domain/_test'
import { mockLoadSurveyById } from '@/presentation/_test'
import { LoadSurveyResultController } from './load-survey-result-controller'

function makeSut () {
  const loadSurveyByIdStub = mockLoadSurveyById({
    returnValue: mockSurveyModel()
  })

  const sut = new LoadSurveyResultController(loadSurveyByIdStub)

  return {
    sut,
    loadSurveyByIdStub
  }
}

describe('LoadSurveyResultController', () => {
  const fakeRequest = {
    params: {
      surveyId: 'any_id'
    }
  }

  it('should call LoadSurveyById with correct value', async () => {
    const { sut, loadSurveyByIdStub } = makeSut()
    await sut.handle(fakeRequest)

    expect(loadSurveyByIdStub.loadById).toHaveBeenCalledWith(fakeRequest.params.surveyId)
  })
})
