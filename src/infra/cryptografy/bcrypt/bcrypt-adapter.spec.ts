import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const hashSpy = jest.spyOn(bcrypt, 'hash')

hashSpy.mockImplementation(() => 'hashed_value')

const compareSpy = jest.spyOn(bcrypt, 'compare')

compareSpy.mockImplementation(() => true)

describe('Bcrypt Adapter', () => {
  const salt = 12

  describe('hash()', () => {
    it('should call bcrypt.hash with correct value', async () => {
      const sut = new BcryptAdapter(salt)
      await sut.hash('any_value')

      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    it('should return a valid hash value on hash success', async () => {
      const sut = new BcryptAdapter(salt)
      const hash = await sut.hash('any_value')

      expect(hash).toBe('hashed_value')
    })

    it('should throws if bcrypt.hash throws', async () => {
      const sut = new BcryptAdapter(salt)
      hashSpy.mockImplementationOnce(() => { throw new Error() })

      await expect(sut.hash('any_value')).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    it('should call bcrypt.compare with correct values', async () => {
      const sut = new BcryptAdapter(salt)
      await sut.compare('any_value', 'any_hash')

      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    it('should return true on compare succeeds', async () => {
      const sut = new BcryptAdapter(salt)
      const isValid = await sut.compare('any_value', 'any_hash')

      expect(isValid).toBe(true)
    })

    it('should return false on compare fails', async () => {
      const sut = new BcryptAdapter(salt)
      compareSpy.mockImplementationOnce(() => false)
      const isValid = await sut.compare('any_value', 'any_hash')

      expect(isValid).toBe(false)
    })

    it('should throws if bcrypt.compare throws', async () => {
      const sut = new BcryptAdapter(salt)
      compareSpy.mockImplementationOnce(() => { throw new Error() })

      await expect(sut.compare('any_value', 'any_hash')).rejects.toThrow()
    })
  })
})
