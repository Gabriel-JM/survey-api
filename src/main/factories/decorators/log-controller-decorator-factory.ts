import { MongoLogRepository } from '@/infra/db/mongodb/log/mongo-log-repository'
import { Controller } from '@/presentation/protocols'
import { LogControllerDecorator } from '@/main/decorators/log/log-controller-decorator'

export function makeLogControllerDecorator (controller: Controller) {
  const logRepository = new MongoLogRepository()

  return new LogControllerDecorator(controller, logRepository)
}
