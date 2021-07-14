import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest } from '../../helpers/http-helper'
import { LoginController } from './login'

function makeSut () {
  const emailValidatorStub = {
    isValid: jest.fn(() => true)
  }

  const sut = new LoginController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('', () => {
  const httpRequest = {
    body: {
      email: 'any_email@mail.com',
      password: 'any_password'
    }
  }

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: {
        password: 'any_password'
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({
      body: {
        email: 'any_email@mail.com'
      }
    })

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  it('shoudl call EmailValidator with correct value', async () => {
    const { sut, emailValidatorStub } = makeSut()

    await sut.handle(httpRequest)

    expect(emailValidatorStub.isValid).toHaveBeenCalledWith(httpRequest.body.email)
  })

  it('should return 400 if the provided email is invalid', async () => {
    const { sut, emailValidatorStub } = makeSut()
    emailValidatorStub.isValid.mockReturnValueOnce(false)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })
})
