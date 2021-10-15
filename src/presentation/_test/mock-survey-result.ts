import { ReturnValue } from '@/data/_test/helpers/types'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResultModel } from '@/domain/_test'

export const mockSaveSurveyResult = ({ returnValue }: ReturnValue<SurveyResultModel>) => ({
  save: jest.fn(() => Promise.resolve(returnValue))
})

export const mockLoadSurveyResult = ({ fakeDate }: { fakeDate?: Date } = {}) => ({
  load: jest.fn(() => Promise.resolve(mockSurveyResultModel(fakeDate)))
})
