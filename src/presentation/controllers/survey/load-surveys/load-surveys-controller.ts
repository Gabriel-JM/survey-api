import { LoadSurveys } from '@/domain/usecases'
import { noContent, ok, serverError } from '../../../helpers/http/http-helper'
import { Controller, HttpResponse } from '@/presentation/protocols'

interface ControllerRequest {
  accountId: string
}

export class LoadSurveysController implements Controller<ControllerRequest> {
  constructor (private readonly loadSurveys: LoadSurveys) {}

  async handle (request: ControllerRequest): Promise<HttpResponse> {
    try {
      const { accountId } = request
      const surveys = await this.loadSurveys.load(String(accountId))

      if (!surveys.length) {
        return noContent()
      }

      return ok(surveys)
    } catch (error) {
      return serverError(error)
    }
  }
}
