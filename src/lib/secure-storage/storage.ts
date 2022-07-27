import * as FileSystem from 'expo-file-system'
import * as SecureStore from 'expo-secure-store'

import { encryptWithRandomKey, decrypt } from './aes'

const storageKey = 'encrypted_storage_key'

const storageDirectoryURI = `${FileSystem.documentDirectory}secure-storage/`
const storageFileNameURI = `${storageDirectoryURI}secure-file-storage`

const encryptAndStoreKey = async (data: string) => {
  const { encryptedData, encryptionKey } = await encryptWithRandomKey(data)
  await SecureStore.setItemAsync(storageKey, encryptionKey)

  return encryptedData
}

const decryptWithStoredKey = async (data: string) => {
  const encryptionKey = await SecureStore.getItemAsync(storageKey)
  if (encryptionKey === null) {
    throw 'Storage key not found'
  }
  const decryptedData = await decrypt(data, encryptionKey)
  return decryptedData
}

const createStorageDirectory = async () => {
  const dirInfo = await FileSystem.getInfoAsync(storageDirectoryURI)
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(storageDirectoryURI, {
      intermediates: true,
    })
  }
}

const createStorageFile = async () => {
  const fileInfo = await FileSystem.getInfoAsync(storageFileNameURI)
  if (!fileInfo.exists) {
    const encryptedData = await encryptAndStoreKey('{}')
    await FileSystem.writeAsStringAsync(storageFileNameURI, encryptedData)
  }
}

const checkOrCreateStorageFile = async () => {
  await createStorageDirectory()
  await createStorageFile()
}

const getDecryptedStorage = async () => {
  await checkOrCreateStorageFile()
  const encryptedStorage = await FileSystem.readAsStringAsync(
    storageFileNameURI
  )
  if (!encryptedStorage || encryptedStorage.length === 0) {
    return {}
  }

  const decryptedStorage = await decryptWithStoredKey(encryptedStorage)
  if (decryptedStorage !== null) {
    const storage = JSON.parse(decryptedStorage)
    return storage
  }
  return {}
}

export const getItem = async (key: string) => {
  const storage = await getDecryptedStorage()

  return storage[key]
}

export const setItem = async (key: string, value: string) => {
  const storage = await getDecryptedStorage()
  const newStorage = { ...storage, [key]: value }

  const newStorageString = JSON.stringify(newStorage)
  const newEncryptedStorage = await encryptAndStoreKey(newStorageString)

  await FileSystem.writeAsStringAsync(storageFileNameURI, newEncryptedStorage)
}

export const clearAll = async () => {
  return FileSystem.deleteAsync(storageFileNameURI)
}
