import {
  addAccountRepositoryStub,
  hasherStub,
  mockCheckAccountByEmailRepository
} from '@/data/_test'
import { fakeAddAccountParams } from '@/domain/_test'
import { DbAddAccountUseCase } from './db-add-account'

function makeSut () {
  const checkAccountByEmailRepositoryStub = mockCheckAccountByEmailRepository()

  const sut = new DbAddAccountUseCase(
    hasherStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepositoryStub
  )

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    checkAccountByEmailRepositoryStub
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

  it('should return false if AddAccountRepository returns false', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    addAccountRepositoryStub.add.mockResolvedValueOnce(false)

    const isValid = await sut.add(fakeAddAccountParams)

    expect(isValid).toBe(false)
  })

  it('should return true on success', async () => {
    const { sut } = makeSut()

    const result = await sut.add(account)

    expect(result).toEqual(true)
  })

  it('should call CheckAccountByEmailRepository with correct email', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()

    await sut.add(account)

    expect(checkAccountByEmailRepositoryStub.checkByEmail)
      .toHaveBeenCalledWith(account.email)
  })

  it('should return null if CheckAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()
    checkAccountByEmailRepositoryStub.checkByEmail.mockResolvedValueOnce(true)

    const result = await sut.add(account)

    expect(result).toBe(false)
  })
})
