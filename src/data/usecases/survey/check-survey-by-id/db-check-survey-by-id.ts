import { CheckSurveyByIdRepository } from '@/data/protocols/db/survey/check-survey-by-id-repository'
import { CheckSurveyById, CheckSurveyByIdResult } from '@/domain/usecases'

export class DbCheckSurveyByIdUsecase implements CheckSurveyById {
  constructor (private readonly checkSurveyByIdRepository: CheckSurveyByIdRepository) {}

  async checkById (id: string): Promise<CheckSurveyByIdResult> {
    return await this.checkSurveyByIdRepository.checkById(id)
  }
}
