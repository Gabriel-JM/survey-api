import { forbidden, ok, serverError } from '../helpers/http/http-helper'
import { AccessDeniedError } from '../errors'
import { AuthMiddleware } from './auth-middleware'
import { AccountModel } from '@/domain/models/account'
import { fakeAccount } from '@/domain/_test'

function makeSut (role?: string) {
  const loadAccountByTokenStub = {
    load: jest.fn<Promise<AccountModel|null>, []>(
      () => Promise.resolve(fakeAccount)
    )
  }

  const sut = new AuthMiddleware(loadAccountByTokenStub, role)

  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  const fakeRequest = {
    accessToken: 'any_token'
  }

  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({
      accessToken: ''
    })

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should call LoadAccountByToken with correct value', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    await sut.handle(fakeRequest)

    expect(loadAccountByTokenStub.load).toHaveBeenCalledWith('any_token', role)
  })

  it('should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    loadAccountByTokenStub.load.mockResolvedValueOnce(null)

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  it('should return 200 if LoadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(ok({ accountId: fakeAccount.id }))
  })

  it('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    loadAccountByTokenStub.load.mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(fakeRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
