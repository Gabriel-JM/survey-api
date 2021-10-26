import { logErrorRepositoryStub } from '@/data/_test'
import { serverError } from '@/presentation/helpers/http/http-helper'
import { LogControllerDecorator } from './log-controller-decorator'

const httpResponseFixture = {
  statusCode: 200,
  body: {
    name: 'Gabriel'
  }
}

function makeSut () {
  const controllerStub = {
    handle: jest.fn(async () => {
      return await Promise.resolve(httpResponseFixture)
    })
  }

  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub)

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub
  }
}

describe('Log Decorator', () => {
  const request = {
    email: 'any_email@mail.com',
    name: 'any_name',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }

  it('should call controller handle with correct value', async () => {
    const { sut, controllerStub } = makeSut()
    await sut.handle(request)

    expect(controllerStub.handle).toHaveBeenCalledWith(request)
  })

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(request)

    expect(response).toEqual(httpResponseFixture)
  })

  it('should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'

    controllerStub.handle.mockResolvedValueOnce(serverError(fakeError))

    await sut.handle(request)

    expect(logErrorRepositoryStub.logError).toHaveBeenCalledWith('any_stack')
  })
})
