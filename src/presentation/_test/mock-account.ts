import { AccountModel } from '@/domain/models/account'
import { fakeAccount } from '@/domain/_test'

export const addAccountStub = {
  add: jest.fn(
    async () => await Promise.resolve(fakeAccount)
  ) as jest.Mock<Promise<AccountModel | null>>
}

export const authenticationStub = {
  auth: jest.fn(
    async () => await Promise.resolve('any_access_token')
  ) as jest.Mock<Promise<string | null>>
}
