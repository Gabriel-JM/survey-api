import { SurveyModel } from '@/domain/models/survey'

export type LoadSurveyByIdRepositoryResult = SurveyModel | null

export interface LoadSurveyByIdRepository {
  loadById(id: string): Promise<LoadSurveyByIdRepositoryResult>
}
