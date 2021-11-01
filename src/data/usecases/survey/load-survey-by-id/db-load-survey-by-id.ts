import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveyById } from '@/domain/usecases'

export class DbLoadSurveyByIdUsecase implements LoadSurveyById {
  constructor (private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  async loadById (id: string) {
    return this.loadSurveyByIdRepository.loadById(id)
  }
}
