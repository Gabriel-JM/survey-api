export class AccessDeniedError extends Error {
  name = 'AccessDeniedError'

  constructor () {
    super('Access Denied')
  }
}
