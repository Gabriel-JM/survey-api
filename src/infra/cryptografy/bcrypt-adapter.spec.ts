import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const hashSpy = jest.spyOn(bcrypt, 'hash')

hashSpy.mockImplementation(() => 'hashed_value')

describe('Bcrypt Adapter', () => {
  const salt = 12

  it('should call bcrypt with correct value', async () => {
    const sut = new BcryptAdapter(salt)
    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('should return the encrypted value on success', async () => {
    const sut = new BcryptAdapter(salt)
    const hash = await sut.encrypt('any_value')

    expect(hash).toBe('hashed_value')
  })

  it('should throws if bcrypt throws', async () => {
    const sut = new BcryptAdapter(salt)
    hashSpy.mockImplementationOnce(() => { throw new Error() })

    await expect(sut.encrypt('any_value')).rejects.toThrow()
  })
})
