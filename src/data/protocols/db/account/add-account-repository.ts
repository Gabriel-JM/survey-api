import { AddAccountParams } from '@/domain/usecases'

export type AddAccountRespositoryParams = AddAccountParams
export type AddAccountRepositoryResult = boolean

export interface AddAccountRepository {
  add(account: AddAccountRespositoryParams): Promise<AddAccountRepositoryResult>
}
