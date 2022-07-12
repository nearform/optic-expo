import {
  documentDirectory,
  writeAsStringAsync,
  EncodingType,
  StorageAccessFramework,
  readAsStringAsync,
} from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { Alert, Platform } from 'react-native'
import Toast from 'react-native-root-toast'

import { Secret } from '../types'

const mimeType = 'application/octet-stream'

const androidExport = async (fileName, fileContent) => {
  const permissions =
    await StorageAccessFramework.requestDirectoryPermissionsAsync()
  if (!permissions.granted) {
    Toast.show('Permissions not granted')
    return
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
    Toast.show('Tokens exported successfully')
  } catch (err) {
    Toast.show('An error occurred while exporting tokens')
    console.log(err)
  }
}

const iosExport = async (fileName, fileContent) => {
  const available = Sharing.isAvailableAsync()
  if (!available) {
    Toast.show('Sharing not available')
    return
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
    Toast.show('Tokens exported successfully')
  } catch (err) {
    Toast.show('An error occurred while exporting tokens')
    console.log(err)
  }
}

export const doExport = (fileName, fileContent) => {
  if (Platform.OS === 'android') {
    androidExport(fileName, fileContent)
  } else {
    iosExport(fileName, fileContent)
  }
}

export const getSecretsFromFile = async uri => {
  if (!uri) {
    return []
  }

  try {
    const result = await readAsStringAsync(uri)
    const parsedSecrets = JSON.parse(result) as Secret[]
    return parsedSecrets
  } catch (err) {
    Toast.show('Unable to parse the backup file')
    console.log(err)
  }
  return []
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
