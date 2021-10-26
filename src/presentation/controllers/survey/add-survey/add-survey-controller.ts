import { AddSurvey } from '@/domain/usecases'
import { badRequest, noContent, serverError } from '../../../helpers/http/http-helper'
import { Controller, Validation } from '@/presentation/protocols'
import { SurveyAnswerModel } from '@/domain/models/survey'

interface ControllerRequest {
  question: string
  answers: SurveyAnswerModel[]
}

export class AddSurveyController implements Controller<ControllerRequest> {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (request: ControllerRequest) {
    try {
      const error = this.validation.validate(request)

      if (error) {
        return badRequest(error)
      }

      const { question, answers } = request

      await this.addSurvey.add({
        question,
        answers,
        date: new Date()
      })

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
