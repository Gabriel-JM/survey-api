import { AccountModel } from '../../../domain/models/account'
import { DbAuthenticationUseCase } from './db-authentication'

const accountModelFake = <AccountModel> {
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
}

function makeSut () {
  const loadAccountByEmailRepositoryStub = {
    load: jest.fn(
      () => Promise.resolve(accountModelFake)
    ) as jest.Mock<Promise<AccountModel| null>>
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

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    loadAccountByEmailRepositoryStub.load.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.auth(authModel)

    await expect(promise).rejects.toThrowError(Error)
  })

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    loadAccountByEmailRepositoryStub.load.mockResolvedValueOnce(null)

    const accessToken = await sut.auth(authModel)

    expect(accessToken).toBeNull()
  })
})
