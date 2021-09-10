import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDbLoadSurveys } from '../../../usecases'

export function makeLoadSurveysController () {
  const loadSurveysUsecase = makeDbLoadSurveys()

  const loadSurveysController = new LoadSurveysController(loadSurveysUsecase)
  return makeLogControllerDecorator(loadSurveysController)
}
