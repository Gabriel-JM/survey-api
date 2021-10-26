import {
  addAccountRepositoryStub,
  hasherStub,
  mockLoadAccountByEmailRepository
} from '@/data/_test'
import { fakeAccount } from '@/domain/_test'
import { DbAddAccountUseCase } from './db-add-account'

function makeSut () {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository({
    returnValue: null
  })

  const sut = new DbAddAccountUseCase(
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  )

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
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

  it('should return true on success', async () => {
    const { sut } = makeSut()

    const result = await sut.add(account)

    expect(result).toEqual(true)
  })

  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    await sut.add(account)

    expect(loadAccountByEmailRepositoryStub.loadByEmail)
      .toHaveBeenCalledWith(account.email)
  })

  it('should return null if LoadAccountByEmailRepository not returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    loadAccountByEmailRepositoryStub.loadByEmail.mockResolvedValueOnce(fakeAccount)

    const result = await sut.add(account)

    expect(result).toBe(false)
  })
})
