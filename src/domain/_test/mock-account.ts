import { AddAccountParams, AuthenticationParams } from '../usecases'

export const fakeAddAccountParams: AddAccountParams = {
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
}

export const fakeAuthenticationParams: AuthenticationParams = {
  email: 'any_email@mail.com',
  password: 'any_password'
}
