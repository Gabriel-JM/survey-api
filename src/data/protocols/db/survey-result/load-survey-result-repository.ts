import { SurveyResultModel } from '@/domain/models/survey-result'

export type LoadSurveyResultRepositoryResult = SurveyResultModel | null

export interface LoadSurveyResultRepository {
  loadBySurveyId(surveyId: string, accountId: string): Promise<LoadSurveyResultRepositoryResult>
}
