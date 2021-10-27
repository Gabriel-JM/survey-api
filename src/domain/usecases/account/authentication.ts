import { AuthenticationModel } from '../../models/authentication'

export interface AuthenticationParams {
  email: string
  password: string
}

export type AuthenticationResult = AuthenticationModel | null

export interface Authentication {
  auth(credentials: AuthenticationParams): Promise<AuthenticationResult>
}
