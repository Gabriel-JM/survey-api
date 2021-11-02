import { SurveyModel } from '@/domain/models/survey'
import { mockSurveyModel } from '@/domain/_test'
import { LoadAnswersBySurveyRepositoryResult } from '../protocols/db/survey/load-answers-by-survey-repository'
import { LoadSurveyByIdRepositoryResult } from '../protocols/db/survey/load-survey-by-id-repository'
import { ReturnValue } from './helpers/types'

export const addSurveyRepositoryStub = {
  add: jest.fn()
}

export const mockLoadSurveyByIdRepository = (fakeDate = new Date()) => ({
  loadById: jest.fn<Promise<LoadSurveyByIdRepositoryResult>, []>(
    () => Promise.resolve(mockSurveyModel(fakeDate))
  )
})

export const mockLoadAnswersBySurveyRepository = () => ({
  loadAnswers: jest.fn<Promise<LoadAnswersBySurveyRepositoryResult>, []>(
    () => Promise.resolve(['any_answer'])
  )
})

export const mockCheckSurveyByIdRepository = () => ({
  checkById: jest.fn(() => Promise.resolve(true))
})

export const mockLoadSurveysRepository = ({
  returnValue
}: ReturnValue<SurveyModel[]>) => ({
  loadAll: jest.fn(() => Promise.resolve(returnValue))
})
