import { encrypterStub, fakeToken, hashComparerStub, mockLoadAccountByEmailRepository, updateAccessTokenRepositoryStub } from '@/data/_test'
import { fakeAccount, fakeAuthenticationParams } from '@/domain/_test'
import { DbAuthenticationUseCase } from './db-authentication'

function makeSut () {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()

  const sut = new DbAuthenticationUseCase(
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('Database Authentication use case', () => {
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    await sut.auth(fakeAuthenticationParams)

    expect(loadAccountByEmailRepositoryStub.loadByEmail)
      .toHaveBeenCalledWith(fakeAuthenticationParams.email)
  })

  it('should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    loadAccountByEmailRepositoryStub.loadByEmail.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.auth(fakeAuthenticationParams)

    await expect(promise).rejects.toThrowError(Error)
  })

  it('should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    loadAccountByEmailRepositoryStub.loadByEmail.mockResolvedValueOnce(null)

    const model = await sut.auth(fakeAuthenticationParams)

    expect(model).toBeNull()
  })

  it('should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()

    await sut.auth(fakeAuthenticationParams)

    expect(hashComparerStub.compare)
      .toHaveBeenCalledWith(fakeAuthenticationParams.password, fakeAccount.password)
  })

  it('should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    hashComparerStub.compare.mockImplementationOnce(() => {
      throw new Error()
    })

    await expect(sut.auth(fakeAuthenticationParams)).rejects.toThrowError(Error)
  })

  it('should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    hashComparerStub.compare.mockResolvedValueOnce(false)

    const model = await sut.auth(fakeAuthenticationParams)

    expect(model).toBeNull()
  })

  it('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()

    await sut.auth(fakeAuthenticationParams)

    expect(encrypterStub.encrypt).toHaveBeenCalledWith(fakeAccount.id)
  })

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    encrypterStub.encrypt.mockImplementationOnce(() => {
      throw new Error()
    })

    await expect(sut.auth(fakeAuthenticationParams)).rejects.toThrowError(Error)
  })

  it('should return an authentication model on success', async () => {
    const { sut } = makeSut()

    const model = await sut.auth(fakeAuthenticationParams)

    expect(model).toEqual({
      accessToken: fakeToken,
      name: fakeAccount.name
    })
  })

  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    await sut.auth(fakeAuthenticationParams)

    expect(updateAccessTokenRepositoryStub.updateAccessToken)
      .toHaveBeenCalledWith(fakeAccount.id, fakeToken)
  })

  it('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    updateAccessTokenRepositoryStub.updateAccessToken.mockImplementationOnce(() => {
      throw new Error()
    })

    await expect(sut.auth(fakeAuthenticationParams)).rejects.toThrowError(Error)
  })
})
