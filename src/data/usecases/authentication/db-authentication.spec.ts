import { DbAuthenticationUseCase } from './db-authentication'

const accountModelFake = {
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
}

function makeSut () {
  const loadAccountByEmailRepositoryStub = {
    load: jest.fn(() => Promise.resolve(accountModelFake))
  }

  const sut = new DbAuthenticationUseCase(loadAccountByEmailRepositoryStub)

  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

describe('Database Authentication use case', () => {
  const authModel = {
    email: 'any_email@mail.com',
    password: 'any_password'
  }

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    await sut.auth(authModel)

    expect(loadAccountByEmailRepositoryStub.load)
      .toHaveBeenCalledWith(authModel.email)
  })
})
