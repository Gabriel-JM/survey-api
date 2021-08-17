import { Controller, HttpRequest, Validation } from '../../../protocols'

export class AddSurveyController implements Controller {
  constructor (private readonly validation: Validation) {}

  async handle (request: HttpRequest) {
    await this.validation.validate(request.body)

    return Promise.resolve({
      statusCode: 200,
      body: {}
    })
  }
}
