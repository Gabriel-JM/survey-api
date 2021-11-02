import { LoadSurveys, LoadSurveysResult } from '@/domain/usecases'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'

export class DbLoadSurveysUseCase implements LoadSurveys {
  constructor (private readonly loadSurveysRepository: LoadSurveysRepository) {}

  async load (accountId: string): Promise<LoadSurveysResult> {
    const surveys = await this.loadSurveysRepository.loadAll(accountId)
    return surveys
  }
}
