import { badRequest } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, Validation } from '../../../protocols'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (request: HttpRequest) {
    const error = await this.validation.validate(request.body)

    if (error) {
      return badRequest(error)
    }

    return Promise.resolve({
      statusCode: 200,
      body: {}
    })
  }
}
