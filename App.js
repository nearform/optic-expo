import * as React from 'react'
import { Provider as PaperProvider } from 'react-native-paper'

import { AuthenticationProvider } from './context/authentication'
import Main from './Main'
import theme from './defaultTheme'

export default function App() {
  return (
    <AuthenticationProvider>
      <PaperProvider theme={theme}>
        <Main />
      </PaperProvider>
    </AuthenticationProvider>
  )
}
