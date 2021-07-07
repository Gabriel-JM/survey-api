export class ServerError extends Error {
  name = 'ServerError'

  constructor (public stack: string) {
    super('Internal server error')
  }
}
