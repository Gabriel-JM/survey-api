import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller'
import { makeLogControllerDecorator } from '@/main/factories/decorators'
import { makeDbAddSurvey } from '@/main/factories/usecases'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

export function makeAddSurveyController () {
  const addSurveyValidation = makeAddSurveyValidation()
  const addSurveyUsecase = makeDbAddSurvey()

  const addSurveyController = new AddSurveyController(addSurveyValidation, addSurveyUsecase)

  return makeLogControllerDecorator(addSurveyController)
}
