import { CheckSurveyById, LoadSurveyResult } from '@/domain/usecases'
import { InvalidParamError } from '@/presentation/errors'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { Controller, HttpResponse } from '@/presentation/protocols'

interface ControllerRequest {
  surveyId: string
  accountId: string
}

export class LoadSurveyResultController implements Controller<ControllerRequest> {
  constructor (
    private readonly checkSurveyById: CheckSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle (request: ControllerRequest): Promise<HttpResponse> {
    try {
      const { accountId, surveyId } = request
      const survey = await this.checkSurveyById.checkById(surveyId)

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const surveyResult = await this.loadSurveyResult.load(surveyId, accountId)

      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
