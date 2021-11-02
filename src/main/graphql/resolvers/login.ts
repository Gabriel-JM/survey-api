import { adaptResolver } from '@/main/adapters'
import { makeLoginController } from '@/main/factories/controllers'

export default {
  Query: {
    login: adaptResolver(makeLoginController())
  }
}
