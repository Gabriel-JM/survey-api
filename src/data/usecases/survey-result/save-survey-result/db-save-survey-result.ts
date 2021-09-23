import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases'

export class DbSaveSurveyResultUsecase implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}

  async save (survey: SaveSurveyResultParams) {
    const surveyResult = await this.saveSurveyResultRepository.save(survey)
    return surveyResult
  }
}
