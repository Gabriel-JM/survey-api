import { DbLoadAccountByTokenUseCase } from './db-load-account-by-token'

function makeSut () {
  const decrypterStub = {
    decrypt: jest.fn(() => Promise.resolve('any_value'))
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
    await sut.load('any_token')

    expect(decrypterStub.decrypt).toHaveBeenCalledWith('any_token')
  })
})
