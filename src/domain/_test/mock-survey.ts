import { SurveyModel } from '../models/survey'

export const mockSurveyModel = (fakeDate = new Date()): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: fakeDate
})
