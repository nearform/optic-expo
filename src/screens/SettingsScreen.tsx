import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Switch } from 'react-native-paper'
import { StackNavigationProp } from '@react-navigation/stack'

import { usePrefs } from '../context/PrefsContext'
import { MainStackParamList } from '../Main'
import theme from '../lib/theme'
import { Typography } from '../components/Typography'
import { useCanUseLocalAuth } from '../hooks/use-can-use-local-auth'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
  scrollView: {
    flexGrow: 1,
  },
  row: {
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

type SettingsScreenProps = {
  navigation: StackNavigationProp<MainStackParamList, 'Settings'>
}

export const SettingsScreen: React.FC<SettingsScreenProps> = () => {
  const { prefs, save } = usePrefs()
  const canUseLocalAuth = useCanUseLocalAuth()

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.row}>
          <Typography variant="subtitle1">Require Auth for Approval</Typography>
          <Switch
            value={prefs.useBiometricAuth}
            onValueChange={() => {
              save('useBiometricAuth', !prefs.useBiometricAuth)
            }}
            disabled={!canUseLocalAuth}
          />
        </View>
      </ScrollView>
    </View>
  )
}
