import { AccountModel } from '../../../domain/models/account'
import { DbAuthenticationUseCase } from './db-authentication'

const accountModelFake = <AccountModel> {
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
}

function makeSut () {
  const loadAccountByEmailRepositoryStub = {
    load: jest.fn(
      () => Promise.resolve(accountModelFake)
    ) as jest.Mock<Promise<AccountModel| null>>
  }

  const hashComparerStub = {
    compare: jest.fn(() => Promise.resolve(true))
  }

  const tokenGeneratorStub = {
    generate: jest.fn(() => Promise.resolve('any_token'))
  }

  const sut = new DbAuthenticationUseCase(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub
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

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()

    await sut.auth(authModel)

    expect(hashComparerStub.compare)
      .toHaveBeenCalledWith(authModel.password, accountModelFake.password)
  })

  it('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    hashComparerStub.compare.mockImplementationOnce(() => {
      throw new Error()
    })

    await expect(sut.auth(authModel)).rejects.toThrowError(Error)
  })

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    hashComparerStub.compare.mockResolvedValueOnce(false)

    const accessToken = await sut.auth(authModel)

    expect(accessToken).toBeNull()
  })

  it('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    await sut.auth(authModel)

    expect(tokenGeneratorStub.generate).toHaveBeenCalledWith(accountModelFake.id)
  })
})
