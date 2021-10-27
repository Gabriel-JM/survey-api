import { AccountModel } from '@/domain/models/account'

export type LoadAccountByTokenRepositoryResult = AccountModel | null

export interface LoadAccountByTokenRepository {
  loadByToken(token: string, role?: string): Promise<LoadAccountByTokenRepositoryResult>
}
