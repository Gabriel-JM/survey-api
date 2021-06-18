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
  const account = {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password'
  }

  it('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()

    await sut.add(account)

    expect(encrypterStub.encrypt).toHaveBeenCalledWith(account.password)
  })

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    encrypterStub.encrypt.mockRejectedValueOnce(new Error())

    await expect(sut.add(account)).rejects.toThrow()
  })
})
