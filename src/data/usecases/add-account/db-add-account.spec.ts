import { DbAddAccountUseCase } from './db-add-account'

const validAccount = {
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
}

function makeSut () {
  const hasherStub = {
    hash: jest.fn(async () => await Promise.resolve('hashed_password'))
  }
  const addAccountRepositoryStub = {
    add: jest.fn(async () => await Promise.resolve(validAccount))
  }

  const sut = new DbAddAccountUseCase(hasherStub, addAccountRepositoryStub)

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Use Case', () => {
  const account = {
    name: 'valid_name',
    email: 'valid_email@mail.com',
    password: 'any_password'
  }

  it('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()

    await sut.add(account)

    expect(hasherStub.hash).toHaveBeenCalledWith(account.password)
  })

  it('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    hasherStub.hash.mockRejectedValueOnce(new Error())

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

    expect(result).toEqual(validAccount)
  })
})
