import { surveysPath, surveyResultPath, signUpPath, loginPath } from './paths'

export const paths = {
  '/login': loginPath,
  '/signup': signUpPath,
  '/surveys': surveysPath,
  '/surveys/{surveyId}/results': surveyResultPath
} as const
