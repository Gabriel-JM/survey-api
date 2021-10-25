import { SurveyResultModel } from '../models/survey-result'
import { SaveSurveyResultParams } from '../usecases'

export const mockSurveyResultModel = (fakeDate = new Date()): SurveyResultModel => ({
  surveyId: 'any_id',
  question: 'any_question',
  answers: [{
    answer: 'any_answer',
    image: 'any_image',
    count: 0,
    percent: 0,
    isCurrentAccountAnswer: true
  }, {
    answer: 'other_answer',
    count: 0,
    percent: 0,
    isCurrentAccountAnswer: false
  }],
  date: fakeDate
})

export const mockSaveSurveyResultParams = (fakeDate = new Date()): SaveSurveyResultParams => ({
  surveyId: 'any_survey_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  date: fakeDate
})
