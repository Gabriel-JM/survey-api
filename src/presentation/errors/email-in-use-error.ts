export class EmailInUseError extends Error {
  name = 'EmailInUseError'

  constructor () {
    super('Provided Email is already in use')
  }
}
