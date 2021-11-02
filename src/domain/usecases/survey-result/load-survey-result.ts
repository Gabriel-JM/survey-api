import { SurveyResultModel } from '../../models/survey-result'

export type LoadSurveyResultResult = SurveyResultModel | null

export interface LoadSurveyResult {
  load(surveyId: string, accountId: string): Promise<LoadSurveyResultResult>
}
