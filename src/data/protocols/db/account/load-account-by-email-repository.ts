export type LoadAccountByEmailRepositoryResult = null | {
  id: string
  name: string
  password: string
}

export interface LoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<LoadAccountByEmailRepositoryResult>
}
