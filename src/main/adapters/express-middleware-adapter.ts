import { Middleware } from '@/presentation/protocols'
import { Request, Response, NextFunction } from 'express'

export function adaptMiddleware (middleware: Middleware) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const request = {
      ...req.headers,
      accessToken: req.headers['x-access-token']
    }

    const httpResponse = await middleware.handle(request)

    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body)
      return next()
    }

    res.status(httpResponse.statusCode).json({
      error: httpResponse.body
    })
  }
}
