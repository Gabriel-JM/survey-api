import { DbAddAccountUseCase } from './db-add-account'

function makeSut () {
  const encrypterStub = {
    encrypt: jest.fn(async () => await Promise.resolve('hashed_password'))
  }
  const addAccountRepositoryStub = {
    add: jest.fn(async () => await Promise.resolve({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    }))
  }

  const sut = new DbAddAccountUseCase(encrypterStub, addAccountRepositoryStub)

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Use Case', () => {
  const account = {
    name: 'valid_name',
    email: 'valid_email@mail.com',
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

  it('should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()

    await sut.add(account)

    expect(addAccountRepositoryStub.add).toHaveBeenCalledWith({
      ...account,
      password: 'hashed_password'
    })
  })

  it('should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    addAccountRepositoryStub.add.mockRejectedValueOnce(new Error())

    await expect(sut.add(account)).rejects.toThrow()
  })

  it('should return an account on success', async () => {
    const { sut } = makeSut()

    const result = await sut.add(account)

    expect(result).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password'
    })
  })
})
