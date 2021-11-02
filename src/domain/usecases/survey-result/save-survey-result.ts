import { SurveyResultModel } from '../../models/survey-result'

export interface SaveSurveyResultParams {
  surveyId: string
  accountId: string
  answer: string
  date: Date
}

export type SaveSurveyResultResult = SurveyResultModel | null

export interface SaveSurveyResult {
  save(data: SaveSurveyResultParams): Promise<SaveSurveyResultResult>
}
