import { ValidationComposite } from './validation-composite'

function makeSut () {
  const validationStub = {
    validate: jest.fn(() => undefined) as jest.Mock<Error | undefined>
  }

  const sut = new ValidationComposite([validationStub])

  return {
    sut,
    validationStub
  }
}

describe('', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationStub } = makeSut()
    validationStub.validate.mockReturnValueOnce(new Error())

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new Error())
  })
})
