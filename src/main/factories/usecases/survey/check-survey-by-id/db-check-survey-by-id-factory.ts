import { DbCheckSurveyByIdUsecase } from '@/data/usecases'
import { MongoSurveyRepository } from '@/infra/db/mongodb/survey/mongo-survey-repository'

export function makeDbCheckSurveyById () {
  const surveyRepository = new MongoSurveyRepository()

  const dbCheckSurveyById = new DbCheckSurveyByIdUsecase(surveyRepository)

  return dbCheckSurveyById
}
