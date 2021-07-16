import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { LoginController } from './login'

function makeSut () {
  const emailValidatorStub = {
    isValid: jest.fn(() => true)
  }

  const authenticationStub = {
    auth: jest.fn(
      async () => await Promise.resolve('any_access_token')
    ) as jest.Mock<Promise<string | null>>
  }

  const sut = new LoginController(emailValidatorStub, authenticationStub)

  return {
    sut,
    emailValidatorStub,
    authenticationStub
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

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    emailValidatorStub.isValid.mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('shoudl call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    await sut.handle(httpRequest)

    expect(authenticationStub.auth).toHaveBeenCalledWith(
      httpRequest.body.email,
      httpRequest.body.password
    )
  })

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    authenticationStub.auth.mockResolvedValueOnce(Promise.resolve(null))

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(unauthorized())
  })

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    authenticationStub.auth.mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
