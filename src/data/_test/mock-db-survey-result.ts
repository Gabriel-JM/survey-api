import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockSurveyResultModel } from '@/domain/_test'

export const mockSaveSurveyResultRepository = () => ({
  save: jest.fn(() => Promise.resolve())
})

export const mockLoadSurveyResultRepository = () => ({
  loadBySurveyId: jest.fn<Promise<SurveyResultModel | null>, []>(
    () => Promise.resolve(mockSurveyResultModel())
  )
})
