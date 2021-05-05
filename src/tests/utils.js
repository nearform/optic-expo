import React from 'react'
import { render } from '@testing-library/react-native'
import { Provider as PaperProvider } from 'react-native-paper'

import { AuthenticationProvider } from '../context/authentication'
import { SecretsProvider } from '../context/secrets'
import theme from '../lib/defaultTheme'

export function renderWithTheme({ ui }) {
  return render(
    <PaperProvider theme={theme}>
      <AuthenticationProvider>
        <SecretsProvider>{ui}</SecretsProvider>
      </AuthenticationProvider>
    </PaperProvider>
  )
}
