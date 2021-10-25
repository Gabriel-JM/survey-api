import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { LoadSurveyByIdRepository } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { SurveyModel } from '@/domain/models/survey'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'

export class DbLoadSurveyResultUsecase implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load (surveyId: string, accountId: string) {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId, accountId)

    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId) as SurveyModel

      surveyResult = {
        surveyId: survey.id,
        question: survey.question,
        answers: survey.answers
          .map(answer => ({
            ...answer,
            count: 0,
            percent: 0,
            isCurrentAccountAnswer: false
          })),
        date: survey.date
      }
    }

    return surveyResult
  }
}
