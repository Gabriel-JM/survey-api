import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResultParams } from '../usecases'

export const mockSurveyResultModel = (fakeDate = new Date()): SurveyResultModel => ({
  id: 'any_id',
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: fakeDate
})

export const mockSaveSurveyResultParams = (fakeDate = new Date()): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: fakeDate
})
