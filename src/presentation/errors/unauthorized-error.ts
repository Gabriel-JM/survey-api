export class UnauthorizedError extends Error {
  name = 'UnauthorizedError'

  constructor () {
    super('Unauthorized')
  }
}
