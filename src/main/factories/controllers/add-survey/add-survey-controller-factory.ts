import { AddSurveyController } from '../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'
import { makeDbAddSurvey } from '../../usecases/add-survey/db-add-survey-factory'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

export function makeAddSurveyController () {
  const addSurveyValidation = makeAddSurveyValidation()
  const addSurveyUsecase = makeDbAddSurvey()

  const addSurveyController = new AddSurveyController(addSurveyValidation, addSurveyUsecase)

  return makeLogControllerDecorator(addSurveyController)
}
