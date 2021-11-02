import { SurveyModel } from '../../models/survey'

export type LoadSurveysResult = SurveyModel[]

export interface LoadSurveys {
  load(accountId: string): Promise<LoadSurveysResult>
}
