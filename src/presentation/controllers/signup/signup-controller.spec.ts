import { MissingParamError, ServerError } from '../../errors'
import { badRequest, ok, serverError } from '../../helpers/http/http-helper'
import { SignUpController } from './signup-controller'

const makeSut = () => {
  const addAccountStub = {
    add: jest.fn(async () => await Promise.resolve({
      id: 'valid_id',
      name: 'any_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }))
  }

  const validationStub = {
    validate: jest.fn(() => undefined) as jest.Mock<Error | undefined>
  }

  const sut = new SignUpController(
    addAccountStub,
    validationStub
  )

  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  const httpRequest = {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }

  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    await sut.handle(httpRequest)
    expect(addAccountStub.add).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  it('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    addAccountStub.add.mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ok({
      id: 'valid_id',
      name: 'any_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }))
  })

  it('shoudl call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()

    await sut.handle(httpRequest)

    expect(validationStub.validate).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    validationStub.validate.mockReturnValueOnce(new MissingParamError('any_field'))

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
