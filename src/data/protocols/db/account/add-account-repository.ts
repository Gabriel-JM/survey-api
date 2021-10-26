import { AccountModel } from '@/domain/models/account'
import { AddAccountParams } from '@/domain/usecases'

export type AddAccountRespositoryParams = AddAccountParams
export type AddAccountRepositoryResult = AccountModel

export interface AddAccountRepository {
  add(account: AddAccountRespositoryParams): Promise<AddAccountRepositoryResult>
}
