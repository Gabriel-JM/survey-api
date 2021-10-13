import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'

export class DbLoadSurveyResultUsecase implements LoadSurveyResult {
  constructor (private readonly loadSurveyResultRepository: LoadSurveyResultRepository) {}

  async load (surveyId: string) {
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)

    return surveyResult
  }
}
