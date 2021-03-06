import { decrypterStub, loadAccountByTokenRepositoryStub } from '@/data/_test'
import { DbLoadAccountByTokenUseCase } from './db-load-account-by-token'

function makeSut () {
  const sut = new DbLoadAccountByTokenUseCase(
    decrypterStub,
    loadAccountByTokenRepositoryStub
  )

  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('Db load account by token use case', () => {
  it('should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    await sut.load('any_token', 'any_role')

    expect(decrypterStub.decrypt).toHaveBeenCalledWith('any_token')
  })

  it('should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    decrypterStub.decrypt.mockResolvedValueOnce(null)

    const response = await sut.load('any_token', 'any_role')

    expect(response).toBeNull()
  })

  it('should throw if Decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    decrypterStub.decrypt.mockImplementationOnce(() => {
      throw new Error()
    })

    const account = await sut.load('any_token', 'any_role')

    expect(account).toBeNull()
  })

  it('should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    await sut.load('any_token', 'any_role')

    expect(loadAccountByTokenRepositoryStub.loadByToken)
      .toHaveBeenCalledWith('any_token', 'any_role')
  })

  it('should return null if LoadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    loadAccountByTokenRepositoryStub.loadByToken.mockResolvedValueOnce(null)

    const response = await sut.load('any_token', 'any_role')

    expect(response).toBeNull()
  })

  it('should throw if LoadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    loadAccountByTokenRepositoryStub.loadByToken.mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.load('any_token', 'any_role')

    await expect(promise).rejects.toThrowError(Error)
  })

  it('should return an account on success', async () => {
    const { sut } = makeSut()
    const response = await sut.load('any_token', 'any_role')

    expect(response).toEqual({ id: 'any_id' })
  })
})
