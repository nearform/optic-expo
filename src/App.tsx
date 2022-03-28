import 'react-native-get-random-values'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Provider as PaperProvider } from 'react-native-paper'
import { RootSiblingParent } from 'react-native-root-siblings'

import { AuthProvider } from './context/AuthContext'
import { SecretsProvider } from './context/SecretsContext'
import theme from './lib/theme'
import Main from './Main'
import { PrefsProvider } from './context/PrefsContext'
import { PendingNotificationsProvider } from './context/PendingNotificationsContext'

export default function App() {
  return (
    <AuthProvider>
      <RootSiblingParent>
        <SecretsProvider>
          <PrefsProvider>
            <PendingNotificationsProvider>
              <PaperProvider theme={theme}>
                <Main />
                <StatusBar style="auto" />
              </PaperProvider>
            </PendingNotificationsProvider>
          </PrefsProvider>
        </SecretsProvider>
      </RootSiblingParent>
    </AuthProvider>
  )
}
