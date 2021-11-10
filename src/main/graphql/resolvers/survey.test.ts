import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { Collection } from 'mongodb'
import { createTestClient, TestClientConfig } from 'apollo-server-integration-testing'
import bcrypt from 'bcrypt'
import { makeApolloServer } from '../_test/helpers'
import { gql } from 'apollo-server-core'

describe('Survey GraphQL', () => {
  let accountCollection: Collection
  let surveyCollection: Collection
  let apolloServer: TestClientConfig['apolloServer']

  beforeAll(async () => {
    apolloServer = await makeApolloServer() as unknown as TestClientConfig['apolloServer']
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  beforeEach(async () => {
    surveyCollection = MongoHelper.getCollection('accounts')
    await surveyCollection.deleteMany({})
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('Surveys Query', () => {
    const surveysQuery = gql`
      query surveys {
        surveys {
          id
          question
          answers {
            image
            answer
          }
          date
          didAnswer
        }
      }
    `

    it('should return Surveys', async () => {
      await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      })

      const password = await bcrypt.hash('123', 12)
      await accountCollection.insertOne({
        name: 'Gabriel José',
        email: 'email@mail.com',
        password
      })

      const { query } = createTestClient({ apolloServer })
      const response = await query<{ surveys: any[] }>(surveysQuery)

      expect(response.data?.surveys).toBeNull()
    })
  })
})
