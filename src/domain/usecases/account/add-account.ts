import { AccountModel } from '../../models/account'

export type AddAccountParams = Omit<AccountModel, 'id'>
export type AddAccountResult = boolean

export interface AddAccount {
  add (account: AddAccountParams): Promise<AddAccountResult>
}
