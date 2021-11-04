import { adaptResolver } from '@/main/adapters'
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '@/main/factories/controllers'

export default {
  Query: {
    surveys: adaptResolver(makeLoadSurveyResultController())
  },

  Mutation: {
    saveSurveyResult: adaptResolver(makeSaveSurveyResultController())
  }
}
