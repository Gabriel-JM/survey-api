import { ReturnValue } from '@/data/_test/helpers/types'
import { SurveyModel } from '@/domain/models/survey'
import { LoadAnswersBySurveyResult } from '@/domain/usecases'

export const addSurveyStub = {
  add: jest.fn()
}

export const mockLoadSurveys = ({ returnValue }: ReturnValue<SurveyModel[]>) => ({
  load: jest.fn(() => Promise.resolve(returnValue))
})

export const mockLoadAnswersBySurvey = () => ({
  loadAnswers: jest.fn<Promise<LoadAnswersBySurveyResult>, []>(() => Promise.resolve(['any_answer']))
})

export const mockCheckSurveyById = () => ({
  checkById: jest.fn(() => Promise.resolve(true))
})
