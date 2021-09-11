import { DbAddSurveyUsecase } from '@/data/usecases/add-survey/db-add-survey'
import { MongoSurveyRepository } from '@/infra/db/mongodb/survey/mongo-survey-repository'

export function makeDbAddSurvey () {
  const addSurveyRepository = new MongoSurveyRepository()

  const dbAddSurvey = new DbAddSurveyUsecase(addSurveyRepository)

  return dbAddSurvey
}
