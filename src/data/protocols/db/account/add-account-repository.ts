import { AccountModel } from '@/domain/models/account'
import { AddAccountModel } from '@/domain/usecases'

export interface AddAccountRepository {
  add(account: AddAccountModel): Promise<AccountModel>
}
