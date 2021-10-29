import { LoadAccountByEmailRepositoryResult } from '../protocols/db/account/load-account-by-email-repository'
import { LoadAccountByTokenRepositoryResult } from '../protocols/db/account/load-account-by-token-repository'

export const addAccountRepositoryStub = {
  add: jest.fn(async () => await Promise.resolve(true))
}

export const fakeLoadAccountByEmailRepositoryResult = {
  id: 'any_id',
  name: 'any_name',
  password: 'any_password'
}

export const mockLoadAccountByEmailRepository = (
  returnValue: LoadAccountByEmailRepositoryResult = fakeLoadAccountByEmailRepositoryResult
) => ({
  loadByEmail: jest.fn(
    () => Promise.resolve(returnValue)
  ) as jest.Mock<Promise<LoadAccountByEmailRepositoryResult>>
})

export const fakeLoadAccountByTokenRepositoryResult = {
  id: 'any_id'
}

export const loadAccountByTokenRepositoryStub = {
  loadByToken: jest.fn<Promise<LoadAccountByTokenRepositoryResult>, []>(
    () => Promise.resolve(fakeLoadAccountByTokenRepositoryResult)
  )
}

export const updateAccessTokenRepositoryStub = {
  updateAccessToken: jest.fn(() => Promise.resolve())
}
