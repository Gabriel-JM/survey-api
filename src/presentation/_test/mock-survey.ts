import { ReturnValue } from '@/data/_test/helpers/types'
import { SurveyModel } from '@/domain/models/survey'

export const addSurveyStub = {
  add: jest.fn()
}

export const mockLoadSurveys = ({ returnValue }: ReturnValue<SurveyModel[]>) => ({
  load: jest.fn(() => Promise.resolve(returnValue))
})

export const mockLoadSurveyById = ({ returnValue }: ReturnValue<SurveyModel>) => ({
  loadById: jest.fn<Promise<SurveyModel|null>, []>(() => Promise.resolve(returnValue))
})
