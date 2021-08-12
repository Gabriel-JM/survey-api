import {
  CompareFieldsValidation,
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite
} from '../../../../presentation/helpers/validators'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../adapters/validators/email-validator-adapter'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../../presentation/helpers/validators/validation-composite')

describe('Sign up validation factory', () => {
  it('should call ValidationComposite with correct values', () => {
    makeSignUpValidation()

    const validations: Validation[] = []

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    )

    validations.push(
      new EmailValidation('email', new EmailValidatorAdapter())
    )

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
