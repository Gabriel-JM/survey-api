import { AddSurvey } from '@/domain/usecases/add-survey'
import { badRequest, noContent, serverError } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, Validation } from '@/presentation/protocols'

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (request: HttpRequest) {
    try {
      const error = this.validation.validate(request.body)

      if (error) {
        return badRequest(error)
      }

      const { question, answers } = request.body

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
