export interface AddAccountParams {
  name: string
  email: string
  password: string
}

export type AddAccountResult = boolean

export interface AddAccount {
  add (account: AddAccountParams): Promise<AddAccountResult>
}
