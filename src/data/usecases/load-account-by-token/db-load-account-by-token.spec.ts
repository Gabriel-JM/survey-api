import { DbLoadAccountByTokenUseCase } from './db-load-account-by-token'

function makeSut () {
  const decrypterStub = {
    decrypt: jest.fn<Promise<string | null>, []>(() => Promise.resolve('any_value'))
  }

  const sut = new DbLoadAccountByTokenUseCase(decrypterStub)

  return {
    sut,
    decrypterStub
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
})
