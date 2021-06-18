import { DbAddAccountUseCase } from './db-add-account'

function makeSut () {
  const encrypterStub = {
    encrypt: jest.fn(async () => await Promise.resolve('hashed_password'))
  }

  const sut = new DbAddAccountUseCase(encrypterStub)

  return {
    sut,
    encrypterStub
  }
}

describe('DbAddAccount Use Case', () => {
  it('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const account = {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    }

    await sut.add(account)

    expect(encrypterStub.encrypt).toHaveBeenCalledWith(account.password)
  })
})
