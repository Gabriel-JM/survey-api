import { InvalidParamError } from '@/presentation/errors'
import { mockEmailValidator } from '../_test'
import { EmailValidation } from './email-validation'

function makeSut () {
  const emailValidatorStub = mockEmailValidator()

  const sut = new EmailValidation(
    'email',
    emailValidatorStub
  )

  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  const input = {
    email: 'any_email@mail.com'
  }

  it('should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    emailValidatorStub.isValid.mockReturnValueOnce(false)

    const input = {
      email: 'invalid_email'
    }

    const error = sut.validate(input)
    expect(error).toEqual(new InvalidParamError('email'))
  })

  it('should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    sut.validate(input)
    expect(emailValidatorStub.isValid).toHaveBeenCalledWith(input.email)
  })

  it('should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    emailValidatorStub.isValid.mockImplementationOnce(() => { throw new Error() })

    expect(sut.validate).toThrowError(Error)
  })

  it('should returns undefined if EmailValidator returns true', () => {
    const { sut } = makeSut()

    const error = sut.validate(input)

    expect(error).toBeUndefined()
  })
})
