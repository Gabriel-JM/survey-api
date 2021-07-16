import { ServerError } from '../errors'
import { UnauthorizedError } from '../errors/unauthorized-error'
import { HttpResponse } from '../protocols'

export function badRequest (error: Error): HttpResponse {
  return {
    statusCode: 400,
    body: error
  }
}

export function unauthorized (): HttpResponse {
  return {
    statusCode: 401,
    body: new UnauthorizedError()
  }
}

export function serverError ({ stack = '' }: Error): HttpResponse {
  return {
    statusCode: 500,
    body: new ServerError(stack)
  }
}

export function ok (data: any): HttpResponse {
  return {
    statusCode: 200,
    body: data
  }
}
