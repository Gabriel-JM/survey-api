import { DbLoadAnswersBySurveyUsecase } from '@/data/usecases'
import { MongoSurveyRepository } from '@/infra/db/mongodb/survey/mongo-survey-repository'

export function makeDbLoadAnswersBySurvey () {
  const surveyRepository = new MongoSurveyRepository()

  const dbLoadSurveyById = new DbLoadAnswersBySurveyUsecase(surveyRepository)

  return dbLoadSurveyById
}
