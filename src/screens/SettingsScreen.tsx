import React from 'react'
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { Switch, Button } from 'react-native-paper'
import { StackNavigationProp } from '@react-navigation/stack'
import * as DocumentPicker from 'expo-document-picker'
import * as MediaLibrary from 'expo-media-library'
import {
  documentDirectory,
  writeAsStringAsync,
  readAsStringAsync,
  EncodingType,
  StorageAccessFramework,
} from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import Toast from 'react-native-root-toast'

import { useSecrets } from '../context/SecretsContext'
import { usePrefs } from '../context/PrefsContext'
import { MainStackParamList } from '../Main'
import theme from '../lib/theme'
import { Typography } from '../components/Typography'
import { useCanUseLocalAuth } from '../hooks/use-can-use-local-auth'
import { useAuth } from '../context/AuthContext'
import { Secret } from '../types'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-between',
    marginBottom: theme.spacing(7),
  },
  row: {
    marginHorizontal: theme.spacing(3),
    paddingTop: theme.spacing(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerRow: {
    paddingTop: theme.spacing(3),
    alignItems: 'center',
  },
})

type SettingsScreenProps = {
  navigation: StackNavigationProp<MainStackParamList, 'Settings'>
}

export const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const { prefs, save } = usePrefs()
  const canUseLocalAuth = useCanUseLocalAuth()
  const { user, handleLogout } = useAuth()
  const { secrets, reset, add } = useSecrets()
  const [status, requestPermission] = MediaLibrary.usePermissions()

  const backupFileNamePattern = 'optic-backup-{TS}'

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
        'application/text'
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

    requestPermission()

    if (!status.granted) {
      Toast.show('Permissions not granted')
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
        mimeType: 'text/plain',
      })
      Toast.show('Tokens exported successfully')
    } catch (err) {
      Toast.show('An error occurred while exporting tokens')
      console.log(err)
    }
  }

  const handleExport = async () => {
    const fileName = backupFileNamePattern.replace(
      '{TS}',
      new Date()
        .toISOString()
        .replace(/[^0-9]/g, '')
        .slice(0, -3)
    )
    const fileContent = JSON.stringify(secrets)

    if (Platform.OS === 'android') {
      androidExport(fileName, fileContent)
    } else {
      iosExport(fileName, fileContent)
    }
  }

  const handleImport = async () => {
    const documentMeta = await DocumentPicker.getDocumentAsync()

    if (documentMeta.type === 'success') {
      const result = await readAsStringAsync(documentMeta.uri)
      const parsedSecrets = JSON.parse(result) as Secret[]

      await reset()
      for (const secret of parsedSecrets) {
        await add(secret)
      }
      Toast.show('Tokens imported successfully')
    } else {
      Toast.show('An error occurred while importing tokens')
    }
  }

  const showImportConfirmAlert = (onConfirm: () => void) => {
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View>
          <View style={styles.row}>
            <Typography variant="subtitle1">
              Require Auth for Approval
            </Typography>
            <Switch
              color={theme.colors.primary}
              value={prefs.useBiometricAuth}
              onValueChange={() => {
                save('useBiometricAuth', !prefs.useBiometricAuth)
              }}
              disabled={!canUseLocalAuth}
            />
          </View>
          <View style={styles.row}>
            <Typography variant="subtitle1">Export tokens</Typography>
            <Button compact onPress={handleExport} icon="file-export">
              Export
            </Button>
          </View>
          <View style={styles.row}>
            <Typography variant="subtitle1">Import tokens</Typography>
            <Button
              compact
              onPress={() => showImportConfirmAlert(handleImport)}
              icon="file-import"
            >
              Import
            </Button>
          </View>
        </View>
        <View>
          <View style={styles.footerRow}>
            <Typography variant="subtitle1">{user.email}</Typography>
          </View>
          <View style={styles.footerRow}>
            <Button onPress={handleLogout} mode="contained">
              Logout
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
