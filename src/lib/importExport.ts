import {
  documentDirectory,
  writeAsStringAsync,
  EncodingType,
  StorageAccessFramework,
  readAsStringAsync,
} from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { Alert, Platform } from 'react-native'
import CryptoJS from 'react-native-crypto-js'

import { Secret } from '../types'

const mimeType = 'application/octet-stream'

function isJsonString(str) {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

const androidExport = async (fileName, fileContent) => {
  const permissions =
    await StorageAccessFramework.requestDirectoryPermissionsAsync()
  if (!permissions.granted) {
    throw Error('Permissions not granted')
  }

  try {
    const uri = await StorageAccessFramework.createFileAsync(
      permissions.directoryUri,
      fileName,
      mimeType
    )

    await writeAsStringAsync(uri, fileContent, {
      encoding: EncodingType.UTF8,
    })
  } catch (err) {
    console.log(err)
    throw Error('An error occurred while exporting tokens')
  }
}

const iosExport = async (fileName, fileContent) => {
  const available = Sharing.isAvailableAsync()
  if (!available) {
    throw Error('Sharing not available')
  }

  const localBackupFileRoute = `${documentDirectory}${fileName}`

  try {
    await writeAsStringAsync(localBackupFileRoute, fileContent, {
      encoding: EncodingType.UTF8,
    })

    await Sharing.shareAsync(localBackupFileRoute, {
      dialogTitle: fileName,
      UTI: 'public.item',
      mimeType,
    })
  } catch (err) {
    console.log(err)
    throw Error('An error occurred while exporting tokens')
  }
}

export const doExport = (fileName, fileContent) => {
  if (Platform.OS === 'android') {
    return androidExport(fileName, fileContent)
  } else {
    return iosExport(fileName, fileContent)
  }
}

export const showImportConfirmAlert = (onConfirm: () => void) => {
  Alert.alert(
    'Import Tokens',
    'This will permanently remove the existing tokens, replacing them with the ones you are importing. Are you sure you want to continue?',
    [
      {
        text: 'CANCEL',
        style: 'cancel',
      },
      { text: 'IMPORT', onPress: onConfirm },
    ],
    { cancelable: true }
  )
}

export const readFile = async (
  uri: string
): Promise<{ fileContent: string; isJson: boolean }> => {
  if (!uri) {
    return {
      fileContent: '',
      isJson: true,
    }
  }
  try {
    const fileContent = await readAsStringAsync(uri)
    const isJson = isJsonString(fileContent)
    return { fileContent, isJson }
  } catch (e) {
    throw Error('Unable to parse the backup file')
  }
}

export const decryptDataToSecrets = (
  fileData: string,
  secret: string
): Secret[] => {
  try {
    if (!fileData) {
      throw new Error("Couldn't decode the file. File is empty!")
    }
    if (!secret) {
      throw new Error("Couldn't decode the file. No secret provided!")
    }
    const bytes = CryptoJS.AES.decrypt(fileData, secret)
    const result = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(result) as Secret[]
  } catch (err) {
    console.log(err)
    throw new Error("Couldn't decrypt the data. ")
  }
}

/**
 * @NOTE This is used only for backward compatibility, files are no longer exported in plain text
 */
export const convertOldParsedDataToSecrets = (data: string): Secret[] => {
  if (!data) {
    return []
  }
  return JSON.parse(data) as Secret[]
}
