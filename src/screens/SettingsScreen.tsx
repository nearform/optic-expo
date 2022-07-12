import React from 'react'
import { Alert, Platform, ScrollView, StyleSheet, View } from 'react-native'
import { Switch, Button } from 'react-native-paper'
import { StackNavigationProp } from '@react-navigation/stack'
import * as DocumentPicker from 'expo-document-picker'
import Toast from 'react-native-root-toast'

import { useSecrets } from '../context/SecretsContext'
import { usePrefs } from '../context/PrefsContext'
import { MainStackParamList } from '../Main'
import theme from '../lib/theme'
import { Typography } from '../components/Typography'
import { useCanUseLocalAuth } from '../hooks/use-can-use-local-auth'
import { useAuth } from '../context/AuthContext'
import { androidExport, iosExport, getSecretsFromFile } from '../lib/settings'

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

  const handleExport = async () => {
    if (secrets.length === 0) {
      Toast.show('There are no secrets to export')
      return
    }

    const fileName = `optic-backup-${new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, -3)}`
    const fileContent = JSON.stringify(secrets)

    if (Platform.OS === 'android') {
      androidExport(fileName, fileContent)
    } else {
      iosExport(fileName, fileContent)
    }
  }

  const handleImport = async () => {
    try {
      const documentMeta = await DocumentPicker.getDocumentAsync()

      if (documentMeta.type === 'success') {
        const parsedSecrets = await getSecretsFromFile(documentMeta.uri)
        if (parsedSecrets.length === 0) {
          Toast.show('No tokens to import')
          return
        }

        await reset()
        for (const secret of parsedSecrets) {
          await add(secret)
        }
        Toast.show('Tokens imported successfully')
      } else if (documentMeta.type === 'cancel') {
        Toast.show('Import canceled')
      } else {
        Toast.show('An error occurred while importing tokens')
      }
    } catch (err) {
      Toast.show('An unexpected error occurred while importing tokens')
      console.log(err)
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
