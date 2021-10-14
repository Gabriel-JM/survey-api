import { DbSaveSurveyResultUsecase } from '@/data/usecases'
import { MongoSurveyResultRepository } from '@/infra/db/mongodb/survey-result/mongo-survey-result-repository'

export function makeDbSaveSurveyResult () {
  const surveyResultRepository = new MongoSurveyResultRepository()

  const dbSaveSurveyResult = new DbSaveSurveyResultUsecase(surveyResultRepository, surveyResultRepository)

  return dbSaveSurveyResult
}
