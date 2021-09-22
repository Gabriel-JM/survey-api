import { DbLoadSurveyByIdUsecase } from '@/data/usecases'
import { MongoSurveyRepository } from '@/infra/db/mongodb/survey/mongo-survey-repository'

export function makeDbLoadSurveyById () {
  const surveyRepository = new MongoSurveyRepository()

  const dbLoadSurveyById = new DbLoadSurveyByIdUsecase(surveyRepository)

  return dbLoadSurveyById
}
