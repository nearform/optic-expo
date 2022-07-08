import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Switch, Button } from 'react-native-paper'
import { StackNavigationProp } from '@react-navigation/stack'
import * as DocumentPicker from 'expo-document-picker'
import * as MediaLibrary from 'expo-media-library'
import {
  documentDirectory,
  writeAsStringAsync,
  readAsStringAsync,
} from 'expo-file-system'

import { useSecrets } from '../context/SecretsContext'
import { usePrefs } from '../context/PrefsContext'
import { MainStackParamList } from '../Main'
import theme from '../lib/theme'
import { Typography } from '../components/Typography'
import { useCanUseLocalAuth } from '../hooks/use-can-use-local-auth'
import { useAuth } from '../context/AuthContext'

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
  const { secrets } = useSecrets()
  const [status, requestPermission] = MediaLibrary.usePermissions()

  const backupFileName = 'optic-backup.txt'
  const localBackupFileRoute = `${documentDirectory}${backupFileName}`

  const handleExport = async () => {
    requestPermission()

    if (!status.granted) {
      return
    }

    try {
      const stringified = JSON.stringify(secrets)
      await writeAsStringAsync(localBackupFileRoute, stringified)

      const asset = await MediaLibrary.createAssetAsync(localBackupFileRoute)
      const album = await MediaLibrary.getAlbumAsync('Optic')
      if (album === null) {
        await MediaLibrary.createAlbumAsync('Optic', asset, false)
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false)
      }
    } catch (error) {
      console.log({ error })
    }
  }

  const handleImport = async () => {
    const documentMeta = await DocumentPicker.getDocumentAsync()

    if (documentMeta.type === 'success') {
      const result = await readAsStringAsync(documentMeta.uri)
      const parsed = JSON.parse(result)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.row}>
          <Typography variant="subtitle1">Require Auth for Approval</Typography>
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
          <Button onPress={handleExport} mode="contained">
            Export
          </Button>
        </View>
        <View style={styles.row}>
          <Typography variant="subtitle1">Import tokens</Typography>
          <Button onPress={handleImport} mode="contained">
            Import
          </Button>
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
