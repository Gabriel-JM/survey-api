import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

jest.mock('validator', () => {
  return {
    isEmail () {
      return true
    }
  }
})

describe('Email Validator Adapter', () => {
  const sut = new EmailValidatorAdapter()

  it('should return false if validator returns false', () => {
    const email = 'invalid_email@mail.com'
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid(email)

    expect(isValid).toBe(false)
  })

  it('should return true if validator returns true', () => {
    const email = 'valid_email@mail.com'
    const isValid = sut.isValid(email)

    expect(isValid).toBe(true)
  })
})
