import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware'
import { makeDbLoadAccountByToken } from '../usecases'

export function makeAuthMiddleware (role?: string) {
  const loadAccountByTokenUsecase = makeDbLoadAccountByToken()
  const middleware = new AuthMiddleware(loadAccountByTokenUsecase, role)

  return middleware
}
