import { Express } from 'express'
import { bodyParser, contentType, cors } from '../middlewares'

export default (app: Express) => {
  app.use(contentType)
  app.use(bodyParser)
  app.use(cors)
}
