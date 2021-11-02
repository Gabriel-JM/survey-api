import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadAnswersBySurvey } from '@/domain/usecases'

export class DbLoadAnswersBySurveyUsecase implements LoadAnswersBySurvey {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async loadAnswers (id: string) {
    const survey = await this.loadSurveyByIdRepository.loadById(id)
    return survey?.answers.map(answer => answer.answer) ?? []
  }
}
