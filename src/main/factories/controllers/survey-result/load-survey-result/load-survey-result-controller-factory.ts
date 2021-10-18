import { makeDbLoadSurveyById, makeDbLoadSurveyResult } from '@/main/factories/usecases'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'

export function makeLoadSurveyResultController () {
  const loadSurveyByIdUseCase = makeDbLoadSurveyById()
  const loadSurveyResultUseCase = makeDbLoadSurveyResult()

  const loadSurveyResultController = new LoadSurveyResultController(
    loadSurveyByIdUseCase,
    loadSurveyResultUseCase
  )

  return loadSurveyResultController
}
