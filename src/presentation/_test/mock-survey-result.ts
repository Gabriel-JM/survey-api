import { ReturnValue } from '@/data/_test/helpers/types'
import { SurveyResultModel } from '@/domain/models/survey-result'

export const mockSaveSurveyResult = ({ returnValue }: ReturnValue<SurveyResultModel>) => ({
  save: jest.fn(() => Promise.resolve(returnValue))
})
