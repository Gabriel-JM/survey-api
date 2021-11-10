import { AddSurveyRepository, AddSurveyRepositoryParams } from '@/data/protocols/db/survey/add-survey-repository'
import { CheckSurveyByIdRepository, CheckSurveyByIdRepositoryResult } from '@/data/protocols/db/survey/check-survey-by-id-repository'
import { LoadAnswersBySurveyRepository } from '@/data/protocols/db/survey/load-answers-by-survey-repository'
import { LoadSurveyByIdRepository, LoadSurveyByIdRepositoryResult } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { make24HexCharsId } from '@/infra/_test'
import { ObjectId } from 'bson'
import { QueryBuilder } from '../helpers'
import { MongoHelper } from '../helpers/mongo-helper'

type Repository = (
  AddSurveyRepository
  & LoadSurveysRepository
  & LoadSurveyByIdRepository
  & CheckSurveyByIdRepository
  & LoadAnswersBySurveyRepository
)

export class MongoSurveyRepository implements Repository {
  async add (survey: AddSurveyRepositoryParams): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(survey)
  }

  async loadAll (accountId: string) {
    accountId.length < 24 && (accountId = make24HexCharsId())
    const surveyCollection = MongoHelper.getCollection('surveys')
    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        date: 1,
        didAnswer: {
          $gte: [{
            $size: {
              $filter: {
                input: '$result',
                as: 'item',
                cond: {
                  $eq: ['$$item.accountId', new ObjectId(accountId)]
                }
              }
            }
          }, 1]
        }
      })
      .build()

    const surveys = await surveyCollection.aggregate(query).toArray()

    return surveys.length ? MongoHelper.mapCollection(surveys) : surveys
  }

  async loadById (id: string) {
    id.length < 24 && (id = make24HexCharsId())
    const surveysCollection = MongoHelper.getCollection('surveys')
    const survey = await surveysCollection.findOne({ _id: new ObjectId(id) })

    return survey
      ? MongoHelper.map<LoadSurveyByIdRepositoryResult>(survey)
      : null
  }

  async loadAnswers (id: string) {
    const surveysCollection = MongoHelper.getCollection('surveys')
    const query = new QueryBuilder()
      .match({ _id: new ObjectId(id) })
      .project({
        _id: 0,
        answers: '$answers.answer'
      })
      .build()

    const surveys = await surveysCollection.aggregate(query).toArray()

    return surveys[0]?.answers || []
  }

  async checkById (id: string): Promise<CheckSurveyByIdRepositoryResult> {
    const surveysCollection = MongoHelper.getCollection('surveys')
    const survey = await surveysCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { _id: 1 } }
    )

    return survey !== null
  }
}
