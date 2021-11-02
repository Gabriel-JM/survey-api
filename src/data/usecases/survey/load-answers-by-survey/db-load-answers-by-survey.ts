import { LoadAnswersBySurveyRepository } from '@/data/protocols/db/survey/load-answers-by-survey-repository'
import { LoadAnswersBySurvey } from '@/domain/usecases'

export class DbLoadAnswersBySurveyUsecase implements LoadAnswersBySurvey {
  constructor (private readonly loadAnswersBySurveyRepository: LoadAnswersBySurveyRepository) {}

  async loadAnswers (id: string) {
    return await this.loadAnswersBySurveyRepository.loadAnswers(id)
  }
}
