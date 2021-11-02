import { AddSurveyRepository, AddSurveyRepositoryParams } from '@/data/protocols/db/survey/add-survey-repository'
import { CheckSurveyByIdRepository, CheckSurveyByIdRepositoryResult } from '@/data/protocols/db/survey/check-survey-by-id-repository'
import { LoadSurveyByIdRepository, LoadSurveyByIdRepositoryResult } from '@/data/protocols/db/survey/load-survey-by-id-repository'
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository'
import { ObjectId } from 'bson'
import { QueryBuilder } from '../helpers'
import { MongoHelper } from '../helpers/mongo-helper'

type Repository = AddSurveyRepository & LoadSurveysRepository & LoadSurveyByIdRepository & CheckSurveyByIdRepository

export class MongoSurveyRepository implements Repository {
  async add (survey: AddSurveyRepositoryParams): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.insertOne(survey)
  }

  async loadAll (accountId: string) {
    const surveyCollection = await MongoHelper.getCollection('surveys')
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
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveysCollection.findOne({ _id: new ObjectId(id) })

    return survey
      ? MongoHelper.map<LoadSurveyByIdRepositoryResult>(survey)
      : null
  }

  async checkById (id: string): Promise<CheckSurveyByIdRepositoryResult> {
    const surveysCollection = await MongoHelper.getCollection('surveys')
    const survey = await surveysCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { _id: 1 } }
    )

    return survey !== null
  }
}
