import jwt from 'jsonwebtoken'
import { Decrypter } from '../../../data/protocols/criptography/decrypter'
import { Encrypter } from '../../../data/protocols/criptography/encrypter'

export class JWTAdapter implements Encrypter, Decrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    const accessToekn = await jwt.sign({ id: value }, this.secret)
    return accessToekn
  }

  async decrypt (value: string): Promise<string | null> {
    await jwt.verify(value, this.secret)
    return null
  }
}
