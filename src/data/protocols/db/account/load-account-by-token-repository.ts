export type LoadAccountByTokenRepositoryResult = null | {
  id: string
}

export interface LoadAccountByTokenRepository {
  loadByToken(token: string, role?: string): Promise<LoadAccountByTokenRepositoryResult>
}
