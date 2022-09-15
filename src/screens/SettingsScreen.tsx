import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
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
import {
  convertOldParsedDataToSecrets,
  readFile,
  showImportConfirmAlert,
} from '../lib/importExport'

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

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  navigation,
}) => {
  const { prefs, save } = usePrefs()
  const canUseLocalAuth = useCanUseLocalAuth()
  const { user, handleLogout } = useAuth()
  const { secrets, replace } = useSecrets()

  const handleImport = async () => {
    try {
      const documentMeta = await DocumentPicker.getDocumentAsync()

      if (documentMeta.type === 'cancel') {
        Toast.show('Import canceled')
        return
      }

      let parsedSecrets = []
      const { fileContent, isJson } = await readFile(documentMeta.uri)
      if (isJson) {
        parsedSecrets = convertOldParsedDataToSecrets(fileContent)
        if (parsedSecrets.length === 0) {
          Toast.show('No tokens to import')
          return
        }
        await replace(parsedSecrets)
        Toast.show('Tokens imported successfully')
        navigation.navigate('Home')
      } else {
        navigation.navigate('ImportFileSecret', { fileContent })
      }
    } catch (err) {
      Toast.show(err.message)
      console.log(err)
    }
  }

  const addSecretForFileExport = () => {
    navigation.navigate('ExportFileSecret')
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
            <Button
              compact
              onPress={addSecretForFileExport}
              disabled={secrets.length === 0}
              icon="file-export"
            >
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
