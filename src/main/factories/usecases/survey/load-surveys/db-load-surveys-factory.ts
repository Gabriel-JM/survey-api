import { DbLoadSurveysUseCase } from '@/data/usecases/load-surveys/db-load-surveys'
import { MongoSurveyRepository } from '@/infra/db/mongodb/survey/mongo-survey-repository'

export function makeDbLoadSurveys () {
  const surveyRepository = new MongoSurveyRepository()

  const loadSurveysUsecase = new DbLoadSurveysUseCase(surveyRepository)

  return loadSurveysUsecase
}
