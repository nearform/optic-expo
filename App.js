import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Provider as PaperProvider } from 'react-native-paper'
import {
  useFonts as usePoppins,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'
import {
  useFonts as useDidactGothic,
  DidactGothic_400Regular,
} from '@expo-google-fonts/didact-gothic'
import AppLoading from 'expo-app-loading'

import { AuthenticationProvider } from './context/authentication'
import { SecretsProvider } from './context/secrets'
import Main from './components/Main'
import theme from './lib/defaultTheme'

export default function App() {
  const [hasPoppinsLoaded] = usePoppins({
    Poppins_700Bold,
  })

  const [hasDidactLoaded] = useDidactGothic({
    DidactGothic_400Regular,
  })

  if (!hasDidactLoaded || !hasPoppinsLoaded) {
    return <AppLoading />
  }

  return (
    <AuthenticationProvider>
      <SecretsProvider>
        <PaperProvider theme={theme}>
          <Main />
          <StatusBar style="auto" />
        </PaperProvider>
      </SecretsProvider>
    </AuthenticationProvider>
  )
}
