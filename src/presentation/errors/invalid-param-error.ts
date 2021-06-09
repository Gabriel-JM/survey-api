export class InvalidParamError extends Error {
  name = 'InvalidParamError'

  constructor (paramName: string) {
    super(`Invalid Param: ${paramName}`)
  }
}
