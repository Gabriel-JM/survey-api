export interface Decrypter {
  decrypt(value: String): Promise<string>
}
