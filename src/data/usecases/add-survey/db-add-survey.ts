import { AddSurvey, AddSurveyModel } from '@/domain/usecases/add-survey'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'

export class DbAddSurveyUsecase implements AddSurvey {
  constructor (private readonly addSurveyRepository: AddSurveyRepository) {}

  async add (survey: AddSurveyModel): Promise<void> {
    await this.addSurveyRepository.add(survey)
  }
}
