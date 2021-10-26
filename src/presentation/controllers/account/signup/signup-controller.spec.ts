import { addAccountStub, authenticationStub } from '@/presentation/_test'
import { mockValidation } from '@/validation/_test'
import { EmailInUseError, MissingParamError, ServerError } from '../../../errors'
import { badRequest, forbidden, ok, serverError } from '../../../helpers/http/http-helper'
import { SignUpController } from './signup-controller'

const makeSut = () => {
  const validationStub = mockValidation()

  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub
  )

  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

describe('SignUp Controller', () => {
  const fakeRequest = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }

  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    await sut.handle(fakeRequest)
    expect(addAccountStub.add).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    addAccountStub.add.mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })

  it('should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()
    addAccountStub.add.mockResolvedValueOnce(null)

    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  it('should return 200 if valid data is provided', async () => {
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

  it('shoudl call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    await sut.handle(fakeRequest)

    expect(authenticationStub.auth).toHaveBeenCalledWith({
      email: fakeRequest.email,
      password: fakeRequest.password
    })
  })

  it('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    const error = new Error()
    error.stack = undefined
    authenticationStub.auth.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(error))
  })
})
