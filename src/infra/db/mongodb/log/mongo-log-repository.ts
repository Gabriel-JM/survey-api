import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'
import { MongoHelper } from '../helpers/mongo-helper'

export class MongoLogRepository implements LogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorsCollection = MongoHelper.getCollection('errors')
    await errorsCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
