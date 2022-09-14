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

function IsJsonString(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
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

export const getSecretsFromFile = async (uri: string, secret: string) => {
  if (!uri) {
    return []
  }
  try {
    const result = await readAsStringAsync(uri)
    let confirmedString: string

    if (IsJsonString(result)) {
      confirmedString = result
    } else {
      const bytes = CryptoJS.AES.decrypt(result + ' ', secret)
      confirmedString = bytes.toString(CryptoJS.enc.Utf8)
    }
    const parsedSecrets = JSON.parse(confirmedString) as Secret[]
    return parsedSecrets
  } catch (err) {
    console.log(err)
    throw Error('Unable to parse the backup file')
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
