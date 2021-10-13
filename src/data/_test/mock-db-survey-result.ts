import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResultModel } from '@/domain/_test'
import { ReturnValue } from './helpers/types'

export const mockSaveSurveyResultRepository = ({
  returnValue
}: ReturnValue<SurveyResultModel>) => ({
  save: jest.fn(() => Promise.resolve(returnValue))
})

export const mockLoadSurveyResultRepository = () => ({
  loadBySurveyId: jest.fn(() => Promise.resolve(mockSurveyResultModel()))
})
