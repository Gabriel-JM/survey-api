import { AddAccountResult, AuthenticationResult } from '@/domain/usecases'

export const addAccountStub = {
  add: jest.fn(
    async () => await Promise.resolve(true)
  ) as jest.Mock<Promise<AddAccountResult>>
}

export const authenticationStub = {
  auth: jest.fn(
    async () => await Promise.resolve({
      accessToken: 'any_access_token',
      name: 'any_name'
    })
  ) as jest.Mock<Promise<AuthenticationResult>>
}
