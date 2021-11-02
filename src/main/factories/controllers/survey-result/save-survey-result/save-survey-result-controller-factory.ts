import { makeDbLoadAnswersBySurvey, makeDbSaveSurveyResult } from '@/main/factories/usecases'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'

export function makeSaveSurveyResultController () {
  const loadAnswersBySurvey = makeDbLoadAnswersBySurvey()
  const saveSurveyResult = makeDbSaveSurveyResult()

  const saveSurveyResultController = new SaveSurveyResultController(
    loadAnswersBySurvey,
    saveSurveyResult
  )

  return saveSurveyResultController
}
