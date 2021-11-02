import { makeDbCheckSurveyById, makeDbLoadSurveyResult } from '@/main/factories/usecases'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'

export function makeLoadSurveyResultController () {
  const checkSurveyByIdUseCase = makeDbCheckSurveyById()
  const loadSurveyResultUseCase = makeDbLoadSurveyResult()

  const loadSurveyResultController = new LoadSurveyResultController(
    checkSurveyByIdUseCase,
    loadSurveyResultUseCase
  )

  return loadSurveyResultController
}
