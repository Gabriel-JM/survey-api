import { SaveSurveyResultParams } from '@/domain/usecases'

export type SaveSurveyResultRepositoryParams = SaveSurveyResultParams

export interface SaveSurveyResultRepository {
  save(data: SaveSurveyResultParams): Promise<void>
}
