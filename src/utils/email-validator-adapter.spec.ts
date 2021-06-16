import { EmailValidatorAdapter } from './email-validator-adapter'

describe('Email Validator Adapter', () => {
  const sut = new EmailValidatorAdapter()

  it('should return false if validator returns false', () => {
    const email = 'invalid_email@mail.com'
    const isValid = sut.isValid(email)

    expect(isValid).toBe(false)
  })
})
