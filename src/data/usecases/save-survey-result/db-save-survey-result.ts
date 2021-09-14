import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SaveSurveyResult, SaveSurveyResultModel } from '@/domain/usecases/save-survey-result'

export class DbSaveSurveyResultUsecase implements SaveSurveyResult {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}

  async save (survey: SaveSurveyResultModel) {
    const surveyResult = await this.saveSurveyResultRepository.save(survey)
    return surveyResult
  }
}
