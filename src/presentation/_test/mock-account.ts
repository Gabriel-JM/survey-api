import { AccountModel } from '@/domain/models/account'
import { AuthenticationModel } from '@/domain/models/authentication'
import { fakeAccount } from '@/domain/_test'

export const addAccountStub = {
  add: jest.fn(
    async () => await Promise.resolve(fakeAccount)
  ) as jest.Mock<Promise<AccountModel | null>>
}

export const authenticationStub = {
  auth: jest.fn(
    async () => await Promise.resolve({
      accessToken: 'any_access_token',
      name: 'any_name'
    })
  ) as jest.Mock<Promise<AuthenticationModel | null>>
}
