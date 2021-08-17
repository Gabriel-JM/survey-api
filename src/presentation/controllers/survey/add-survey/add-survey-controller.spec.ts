import { AddSurveyController } from './add-survey-controller'
import { badRequest } from '../../../helpers/http/http-helper'

function makeSut () {
  const validationStub = {
    validate: jest.fn<Error | undefined, []>(() => undefined)
  }

  const sut = new AddSurveyController(validationStub)

  return {
    sut,
    validationStub
  }
}

describe('Add Survey Controller', () => {
  const fakeHttpRequest = {
    body: {
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    }
  }

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    await sut.handle(fakeHttpRequest)

    expect(validationStub.validate).toHaveBeenCalledWith(fakeHttpRequest.body)
  })

  it('should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    validationStub.validate.mockReturnValueOnce(new Error())

    const response = await sut.handle(fakeHttpRequest)

    expect(response).toEqual(badRequest(new Error()))
  })
})
