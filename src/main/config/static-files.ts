import express, { Express } from 'express'
import path from 'path'

export default (app: Express) => {
  app.use('/static', express.static(path.resolve('dist', 'static')))
}
