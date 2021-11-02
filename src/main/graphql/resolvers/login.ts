import { adaptResolver } from '@/main/adapters'
import { makeLoginController, makeSignUpController } from '@/main/factories/controllers'

export default {
  Query: {
    login: adaptResolver(makeLoginController())
  },

  Mutation: {
    signUp: adaptResolver(makeSignUpController())
  }
}
