export const mockValidation = () => ({
  validate: jest.fn(() => undefined) as jest.Mock<Error | undefined>
})
