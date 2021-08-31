import jwt from 'jsonwebtoken'
import { JWTAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => {
  return {
    sign: jest.fn(() => Promise.resolve('any_token'))
  }
})

describe('JWT Adapter', () => {
  describe('sign()', () => {
    it('should call jwt.sign with correct values', async () => {
      const sut = new JWTAdapter('secret')
      const signSpy = jest.spyOn(jwt, 'sign')

      await sut.encrypt('any_id')

      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    it('should return a token on encrypt success', async () => {
      const sut = new JWTAdapter('secret')
      const accessToken = await sut.encrypt('any_id')

      expect(accessToken).toBe('any_token')
    })

    it('should throw if jwt throws', async () => {
      const sut = new JWTAdapter('secret')
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })

      await expect(sut.encrypt('any_id')).rejects.toThrowError(Error)
    })
  })

  describe('verify()', () => {

  })
})
