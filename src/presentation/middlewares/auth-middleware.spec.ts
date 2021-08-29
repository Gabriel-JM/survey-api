import { forbidden } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { AccountModel } from '../../domain/models/account'

const fakeAccount = {
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
}

function makeSut () {
  const loadAccountByTokenStub = {
    load: jest.fn<Promise<AccountModel|null>, []>(
      () => Promise.resolve(fakeAccount)
    )
  }

  const sut = new AuthMiddleware(loadAccountByTokenStub)

  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  const fakeRequest = {
    headers: {
      'x-access-token': 'any_token'
    }
  }

  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should call LoadAccountByToken with correct value', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    await sut.handle(fakeRequest)

    expect(loadAccountByTokenStub.load).toHaveBeenCalledWith('any_token')
  })

  it('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    loadAccountByTokenStub.load.mockResolvedValueOnce(null)

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
