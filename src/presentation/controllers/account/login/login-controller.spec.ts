import { MissingParamError } from '@/presentation/errors'
import { badRequest, ok, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { authenticationStub } from '@/presentation/_test'
import { mockValidation } from '@/validation/_test'
import { LoginController } from './login-controller'

function makeSut () {
  const validationStub = mockValidation()

  const sut = new LoginController(authenticationStub, validationStub)

  return {
    sut,
    authenticationStub,
    validationStub
  }
}

describe('LoginController', () => {
  const fakeRequest = {
    email: 'any_email@mail.com',
    password: 'any_password'
  }

  it('shoudl call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    await sut.handle(fakeRequest)

    expect(authenticationStub.auth).toHaveBeenCalledWith(
      { ...fakeRequest }
    )
  })

  it('should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    authenticationStub.auth.mockResolvedValueOnce(Promise.resolve(null))

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(unauthorized())
  })

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    const error = new Error()
    error.stack = undefined
    authenticationStub.auth.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(error))
  })

  it('should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(ok({
      accessToken: 'any_access_token',
      name: 'any_name'
    }))
  })

  it('shoudl call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()

    await sut.handle(fakeRequest)

    expect(validationStub.validate).toHaveBeenCalledWith(fakeRequest)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    validationStub.validate.mockReturnValueOnce(new MissingParamError('any_field'))

    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
