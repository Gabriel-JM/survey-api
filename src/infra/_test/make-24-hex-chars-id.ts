const randomHex = () => Math.random().toString(16).substr(2)

export function make24HexCharsId () {
  const str = `${randomHex()}${randomHex()}`

  return str.length > 24 ? str.substring(0, 24) : str
}
