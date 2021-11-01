import { SurveyModel } from '../../models/survey'

export type LoadSurveyByIdResult = SurveyModel | null

export interface LoadSurveyById {
  loadById(id: string): Promise<LoadSurveyByIdResult>
}
