import React from 'react'
import { render } from '@testing-library/react-native'
import { Provider as PaperProvider } from 'react-native-paper'
import { StackNavigationProp } from '@react-navigation/stack'

import theme from '../src/lib/theme'
import { MainStackParamList } from '../src/Main'

export function renderWithTheme(ui: React.ReactElement) {
  return render(<PaperProvider theme={theme}>{ui}</PaperProvider>)
}

export function getMockedNavigation<
  P extends keyof MainStackParamList = 'Home',
  T = StackNavigationProp<MainStackParamList, P>
>(fns?: T) {
  return {
    navigate: jest.fn(),
    goBack: jest.fn(),
    replace: jest.fn(),
    ...fns,
  } as T
}
