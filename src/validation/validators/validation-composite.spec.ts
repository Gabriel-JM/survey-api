import { InvalidParamError, MissingParamError } from '@/presentation/errors'
import { ValidationComposite } from './validation-composite'

function makeSut () {
  const validationStubs = [
    {
      validate: jest.fn(() => undefined) as jest.Mock<Error | undefined>
    },
    {
      validate: jest.fn(() => undefined) as jest.Mock<Error | undefined>
    }
  ]

  const sut = new ValidationComposite(validationStubs)

  return {
    sut,
    validationStubs
  }
}

describe('', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()
    validationStubs[0].validate.mockReturnValueOnce(new Error())

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new Error())
  })

  it('should return the first error if more then on validation fails', () => {
    const { sut, validationStubs } = makeSut()
    validationStubs[0].validate.mockReturnValueOnce(new MissingParamError('field'))
    validationStubs[1].validate.mockReturnValueOnce(new InvalidParamError('field'))

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new MissingParamError('field'))
  })

  it('should return undefined if neither validations fails', () => {
    const { sut } = makeSut()

    const error = sut.validate({ field: 'any_value' })

    expect(error).toBeUndefined()
  })
})
