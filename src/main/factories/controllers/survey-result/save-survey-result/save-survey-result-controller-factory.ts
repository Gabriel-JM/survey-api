import { makeDbLoadSurveyById, makeDbSaveSurveyResult } from '@/main/factories/usecases'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'

export function makeSaveSurveyResultController () {
  const loadSurveyById = makeDbLoadSurveyById()
  const saveSurveyResult = makeDbSaveSurveyResult()

  const saveSurveyResultController = new SaveSurveyResultController(loadSurveyById, saveSurveyResult)

  return saveSurveyResultController
}
