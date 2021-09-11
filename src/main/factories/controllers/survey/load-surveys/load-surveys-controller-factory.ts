import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller'
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-decorator-factory'
import { makeDbLoadSurveys } from '@/main/factories/usecases'

export function makeLoadSurveysController () {
  const loadSurveysUsecase = makeDbLoadSurveys()

  const loadSurveysController = new LoadSurveysController(loadSurveysUsecase)
  return makeLogControllerDecorator(loadSurveysController)
}
