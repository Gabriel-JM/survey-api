import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

describe('Compare fields Validation', () => {
  it('should return a InvalidParamError if has fields values difference', () => {
    const sut = new CompareFieldsValidation('field', 'fieldToCompare')

    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'wrong_value'
    })

    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  it('should return undefined if validation succeeds', () => {
    const sut = new CompareFieldsValidation('field', 'fieldToCompare')

    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    })

    expect(error).toBeUndefined()
  })
})
