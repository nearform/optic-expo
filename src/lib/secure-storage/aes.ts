import aesjs from 'aes-js'

const generateRandomKey = (): Uint8Array => {
  return global.crypto.getRandomValues(new Uint8Array(32))
}

interface EncryptionResult {
  encryptedData: string
  encryptionKey: string
}

export const encryptWithRandomKey = async (
  data: string
): Promise<EncryptionResult> => {
  const encryptionKey = await generateRandomKey()
  const dataBytes = aesjs.utils.utf8.toBytes(data)
  const aesCtr = new aesjs.ModeOfOperation.ctr(
    encryptionKey,
    new aesjs.Counter(5)
  )
  const encryptedBytes = aesCtr.encrypt(dataBytes)
  const encryptedData = aesjs.utils.hex.fromBytes(encryptedBytes)

  return {
    encryptedData,
    encryptionKey: Buffer.from(encryptionKey).toString('hex'),
  }
}

export const decrypt = async (
  data: string,
  key: string
): Promise<string | null> => {
  const encryptedKey = Uint8Array.from(Buffer.from(key, 'hex'))
  const encryptedBytes = aesjs.utils.hex.toBytes(data)
  const aesCtr = new aesjs.ModeOfOperation.ctr(
    encryptedKey,
    new aesjs.Counter(5)
  )
  const decryptedBytes = aesCtr.decrypt(encryptedBytes)
  return aesjs.utils.utf8.fromBytes(decryptedBytes)
}
