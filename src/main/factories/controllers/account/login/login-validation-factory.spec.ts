import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('@/validation/validators/validation-composite')

describe('Login validation factory', () => {
  it('should call ValidationComposite with correct values', () => {
    makeLoginValidation()

    const validations: Validation[] = []

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(
      new EmailValidation('email', new EmailValidatorAdapter())
    )

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
