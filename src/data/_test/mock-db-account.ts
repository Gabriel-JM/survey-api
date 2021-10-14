import { AccountModel } from '@/domain/models/account'
import { fakeAccount } from '@/domain/_test'
import { ReturnValue } from './helpers/types'

export const addAccountRepositoryStub = {
  add: jest.fn(async () => await Promise.resolve(fakeAccount))
}

export const mockLoadAccountByEmailRepository = ({
  returnValue
}: ReturnValue<AccountModel | null> = { returnValue: fakeAccount }) => ({
  loadByEmail: jest.fn(
    () => Promise.resolve(returnValue)
  ) as jest.Mock<Promise<AccountModel | null>>
})

export const loadAccountByTokenRepositoryStub = {
  loadByToken: jest.fn<Promise<AccountModel | null>, []>(
    () => Promise.resolve(fakeAccount)
  )
}

export const updateAccessTokenRepositoryStub = {
  updateAccessToken: jest.fn(() => Promise.resolve())
}