export class MissingParamError extends Error {
  name = 'MissingParamError'

  constructor (paramName: string) {
    super(`Missing param: ${paramName}`)
  }
}
