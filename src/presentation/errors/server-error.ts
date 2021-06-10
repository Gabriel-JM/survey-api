export class ServerError extends Error {
  name = 'ServerError'

  constructor () {
    super('Internal server error')
  }
}
