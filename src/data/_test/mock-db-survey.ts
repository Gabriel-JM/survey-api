import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel } from '@/domain/_test'
import { ReturnValue } from './helpers/types'

export const addSurveyRepositoryStub = {
  add: jest.fn()
}

export const mockLoadSurveyByIdRepository = (fakeDate = new Date()) => ({
  loadById: jest.fn<Promise<SurveyModel|null>, []>(
    () => Promise.resolve(mockSurveyModel(fakeDate))
  )
})

export const mockLoadSurveysRepository = ({
  returnValue
}: ReturnValue<SurveyModel[]>) => ({
  loadAll: jest.fn(() => Promise.resolve(returnValue))
})
