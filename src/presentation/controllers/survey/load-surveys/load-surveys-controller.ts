import { LoadSurveys } from '../../../../domain/usecases/load-surveys'
import { Controller, HttpRequest, HttpResponse } from '../../../protocols'

export class LoadSurveysController implements Controller {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (_httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadSurveys.load()

    return {
      statusCode: 200,
      body: {}
    }
  }
}
