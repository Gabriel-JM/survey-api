import { MissingParamError } from '../../presentation/errors'
import { RequiredFieldValidation } from './required-field-validation'

describe('Required fields Validation', () => {
  it('should return a MissingParamError if field is empty', () => {
    const sut = new RequiredFieldValidation('anyField')

    const error = sut.validate({ anyField: undefined })

    expect(error).toEqual(new MissingParamError('anyField'))
  })

  it('should return undefined if validation succeeds', () => {
    const sut = new RequiredFieldValidation('anyField')

    const error = sut.validate({ anyField: true })

    expect(error).toBeUndefined()
  })
})
