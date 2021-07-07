import { LogControllerDecorator } from './log'

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

  const sut = new LogControllerDecorator(controllerStub)

  return {
    sut,
    controllerStub
  }
}

describe('Log Decorator', () => {
  const httpRequest = {
    body: {
      email: 'any_email@mail.com',
      name: 'any_name',
      password: 'any_password',
      passwordConfirmation: 'any_password'
    }
  }

  it('should call controller handle with correct value', async () => {
    const { sut, controllerStub } = makeSut()
    await sut.handle(httpRequest)

    expect(controllerStub.handle).toHaveBeenCalledWith(httpRequest)
  })

  it('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(httpRequest)

    expect(response).toEqual(httpResponseFixture)
  })
})
