import { SurveyResultModel } from '@/domain/models/survey-result'
import { ReturnValue } from './helpers/types'

export const mockSaveSurveyResultRepository = ({
  returnValue
}: ReturnValue<SurveyResultModel>) => ({
  save: jest.fn(() => Promise.resolve(returnValue))
})
