import { Express, Router } from 'express'
import fs from 'fs'
import path from 'path'

export default (app: Express) => {
  const router = Router()
  app.use('/api', router)

  const routesDir = fs.readdirSync(path.join(__dirname, '..', 'routes'))

  routesDir
    .filter(fileName => !(/.+\.test\./.test(fileName)))
    .forEach(
      async fileName => (await import(`../routes/${fileName}`)).default(router)
    )
}
