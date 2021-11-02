import { SurveyModel } from '@/domain/models/survey'

export type LoadSurveysRepositoryResult = SurveyModel[]

export interface LoadSurveysRepository {
  loadAll(accountId: string): Promise<LoadSurveysRepositoryResult>
}
