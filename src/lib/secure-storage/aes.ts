import { NativeModules } from 'react-native'
const Aes = NativeModules.Aes

const generateRandomKey = async (): Promise<string> => await Aes.randomKey(32)

interface EncriptionResult {
  encryptedData: string
  encryptionKey: string
}

export const encryptWithRandomKey = async (
  data: string
): Promise<EncriptionResult> => {
  const encryptionKey = await generateRandomKey()
  const encryptedData = await Aes.encrypt(data, encryptionKey, null)
  return { encryptedData, encryptionKey }
}

export const decrypt = async (
  data: string,
  key: string
): Promise<string | null> => {
  const decryptedData = await Aes.decrypt(data, key, null)
  return decryptedData
}
