import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { SaveSurveyResultRepository } from '@/data/protocols/db/survey-result/save-survey-result-repository'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases'

export class DbSaveSurveyResultUsecase implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) {}

  async save (survey: SaveSurveyResultParams) {
    await this.saveSurveyResultRepository.save(survey)
    const surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(survey.surveyId, survey.accountId)

    return surveyResult
  }
}
