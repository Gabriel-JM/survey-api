export const hasherStub = {
  hash: jest.fn(async () => await Promise.resolve('hashed_password'))
}

export const hashComparerStub = {
  compare: jest.fn(() => Promise.resolve(true))
}

export const fakeToken = 'any_token'

export const encrypterStub = {
  encrypt: jest.fn(() => Promise.resolve(fakeToken))
}

export const decrypterStub = {
  decrypt: jest.fn<Promise<string | null>, []>(() => Promise.resolve('any_value'))
}
