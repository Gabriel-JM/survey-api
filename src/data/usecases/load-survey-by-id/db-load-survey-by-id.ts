import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveyById } from '@/domain/usecases/load-survey-by-id'

export class DbLoadSurveyByIdUsecase implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async loadById (id: string) {
    const survey = await this.loadSurveyByIdRepository.loadById(id)
    return survey
  }
}
