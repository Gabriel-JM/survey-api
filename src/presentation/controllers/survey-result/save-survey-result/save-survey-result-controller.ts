import { Controller, HttpResponse } from '@/presentation/protocols'
import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { LoadSurveyById, SaveSurveyResult } from '@/domain/usecases'
import { InvalidParamError } from '@/presentation/errors'

interface ControllerRequest {
  surveyId: string
  answer: string
  accountId: string
}

export class SaveSurveyResultController implements Controller<ControllerRequest> {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (request: ControllerRequest): Promise<HttpResponse> {
    try {
      const { surveyId, answer, accountId } = request

      const survey = await this.loadSurveyById.loadById(surveyId)

      if (survey) {
        const answers = survey.answers.map(a => a.answer)

        if (!answers.includes(answer)) {
          return forbidden(new InvalidParamError('answer'))
        }
      } else {
        return forbidden(new InvalidParamError('surveyId'))
      }

      const surveyResult = await this.saveSurveyResult.save({
        surveyId,
        accountId,
        answer,
        date: new Date()
      })

      return ok(surveyResult)
    } catch (error) {
      return serverError(error)
    }
  }
}
