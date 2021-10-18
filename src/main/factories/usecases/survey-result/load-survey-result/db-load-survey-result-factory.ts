import { DbLoadSurveyResultUsecase } from '@/data/usecases'
import { MongoSurveyResultRepository } from '@/infra/db/mongodb/survey-result/mongo-survey-result-repository'
import { MongoSurveyRepository } from '@/infra/db/mongodb/survey/mongo-survey-repository'

export function makeDbLoadSurveyResult () {
  const mongoSurveyResultRepository = new MongoSurveyResultRepository()
  const mongoSurveyRepository = new MongoSurveyRepository()

  const dbLoadSurveyResult = new DbLoadSurveyResultUsecase(
    mongoSurveyResultRepository,
    mongoSurveyRepository
  )

  return dbLoadSurveyResult
}
