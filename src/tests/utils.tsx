import React from 'react'
import { render } from '@testing-library/react-native'
import { Provider as PaperProvider } from 'react-native-paper'

import { AuthProvider } from '../context/AuthContext'
import { SecretsProvider } from '../context/SecretsContext'
import theme from '../lib/theme'

export function renderWithTheme({ ui }) {
  return render(
    <PaperProvider theme={theme}>
      <AuthProvider>
        <SecretsProvider>{ui}</SecretsProvider>
      </AuthProvider>
    </PaperProvider>
  )
}
