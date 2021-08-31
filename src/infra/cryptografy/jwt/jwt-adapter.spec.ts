import jwt from 'jsonwebtoken'
import { JWTAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => {
  return {
    sign: () => Promise.resolve('any_token'),
    verify: () => Promise.resolve('any_value')
  }
})

const makeSut = () => new JWTAdapter('secret')

describe('JWT Adapter', () => {
  describe('sign()', () => {
    it('should call jwt.sign with correct values', async () => {
      const sut = makeSut()
      const signSpy = jest.spyOn(jwt, 'sign')

      await sut.encrypt('any_id')

      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    it('should return a token on encrypt success', async () => {
      const sut = makeSut()
      const accessToken = await sut.encrypt('any_id')

      expect(accessToken).toBe('any_token')
    })

    it('should throw if jwt throws', async () => {
      const sut = makeSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })

      await expect(sut.encrypt('any_id')).rejects.toThrowError(Error)
    })
  })

  describe('verify()', () => {
    it('should call jwt.verify with correct values', async () => {
      const sut = makeSut()
      const verifySpy = jest.spyOn(jwt, 'verify')

      await sut.decrypt('any_token')

      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    it('should return a value on verify success', async () => {
      const sut = makeSut()
      const value = await sut.decrypt('any_token')

      expect(value).toBe('any_value')
    })
  })
})
