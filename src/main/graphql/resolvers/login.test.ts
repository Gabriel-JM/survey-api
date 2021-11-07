import { MongoHelper } from '@/infra/db/mongodb/helpers'
import { Collection } from 'mongodb'
import { createTestClient, TestClientConfig } from 'apollo-server-integration-testing'
import bcrypt from 'bcrypt'
import { makeApolloServer } from '../_test/helpers'
import { gql } from 'apollo-server-core'

describe('Login GraphQL', () => {
  let accountCollection: Collection
  let apolloServer: TestClientConfig['apolloServer']

  beforeAll(async () => {
    apolloServer = await makeApolloServer() as unknown as TestClientConfig['apolloServer']
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('Login Query', () => {
    const loginQuery = gql`
      query login ($email: String!, $password: String!) {
        login (email: $email, password: $password) {
          accessToken
          name
        }
      }
    `

    it('should return an Account on valid credentials', async () => {
      const password = await bcrypt.hash('123', 12)
      await accountCollection.insertOne({
        name: 'Gabriel José',
        email: 'email@mail.com',
        password
      })

      const { query } = createTestClient({ apolloServer })
      const response = await query<{ login: Record<'accessToken' | 'name', string> }>(loginQuery, {
        variables: {
          email: 'email@mail.com',
          password: '123'
        }
      })

      expect(response.data?.login.accessToken).toBeTruthy()
      expect(response.data?.login.name).toBe('Gabriel José')
    })

    it('should return an UnauthorizedError on invalid credentials', async () => {
      const { query } = createTestClient({ apolloServer })
      const response = await query<{ login: Record<'accessToken' | 'name', string> }>(loginQuery, {
        variables: {
          email: 'email@mail.com',
          password: '123'
        }
      })

      expect(response.data).toBeNull()
      expect(response.errors![0].message).toBe('Unauthorized')
    })
  })

  describe('SignUp Mutation', () => {
    const signUpMutation = gql`
      mutation signUp (
        $name: String!,
        $email: String!,
        $password: String!,
        $passwordConfirmation: String!
      ) {
        signUp (
          name: $name,
          email: $email,
          password: $password,
          passwordConfirmation: $passwordConfirmation
        ) {
          accessToken
          name
        }
      }
    `

    it('should return an Account on valid credentials', async () => {
      const { mutate } = createTestClient({ apolloServer })
      const response = await mutate<{ signUp: Record<'accessToken' | 'name', string> }>(
        signUpMutation,
        {
          variables: {
            name: 'Gabriel José',
            email: 'email@mail.com',
            password: '123',
            passwordConfirmation: '123'
          }
        }
      )

      expect(response.data?.signUp.accessToken).toBeTruthy()
      expect(response.data?.signUp.name).toBe('Gabriel José')
    })
  })
})
