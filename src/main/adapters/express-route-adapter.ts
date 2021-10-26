import { Request, Response } from 'express'
import { Controller } from '@/presentation/protocols'

export function adaptRoute (controller: Controller) {
  return async (req: Request, res: Response) => {
    const request = {
      ...(req.params ?? {}),
      ...(req.body ?? {}),
      accountId: req.accountId ?? ''
    }

    const httpResponse = await controller.handle(request)

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).send(httpResponse.body)
    } else {
      res.status(httpResponse.statusCode).send({
        error: httpResponse.body.message
      })
    }
  }
}
