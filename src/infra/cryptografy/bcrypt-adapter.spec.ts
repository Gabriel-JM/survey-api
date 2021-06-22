import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

const hashSpy = jest.spyOn(bcrypt, 'hash')

describe('Bcrypt Adapter', () => {
  const salt = 12

  it('should call bcrypt with correct value', async () => {
    const sut = new BcryptAdapter(salt)
    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
