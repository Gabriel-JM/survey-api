import { AddSurveyController } from './add-survey-controller'
import { badRequest, noContent, serverError } from '../../../helpers/http/http-helper'
import MockDate from 'mockdate'
import { mockValidation } from '@/validation/_test'
import { addSurveyStub } from '@/presentation/_test'

function makeSut () {
  const validationStub = mockValidation()

  const sut = new AddSurveyController(validationStub, addSurveyStub)

  return {
    sut,
    validationStub,
    addSurveyStub
  }
}

describe('Add Survey Controller', () => {
  const date = new Date()
  const fakeHttpRequest = {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]
  }

  beforeAll(() => {
    MockDate.set(date)
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    await sut.handle(fakeHttpRequest)

    expect(validationStub.validate).toHaveBeenCalledWith(fakeHttpRequest)
  })

  it('should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    validationStub.validate.mockReturnValueOnce(new Error())

    const response = await sut.handle(fakeHttpRequest)

    expect(response).toEqual(badRequest(new Error()))
  })

  it('should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()

    await sut.handle(fakeHttpRequest)

    expect(addSurveyStub.add).toHaveBeenCalledWith({ ...fakeHttpRequest, date })
  })

  it('should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()
    addSurveyStub.add.mockImplementationOnce(() => {
      throw new Error()
    })

    const response = await sut.handle(fakeHttpRequest)

    expect(response).toEqual(serverError(new Error()))
  })

  it('should return 204 on success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(fakeHttpRequest)

    expect(response).toEqual(noContent())
  })
})
