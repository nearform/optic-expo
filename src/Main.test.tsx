import React from 'react'

import { renderWithTheme } from '../test/utils'

import { useAuth } from './context/AuthContext'
import Main from './Main'
import { AuthScreen } from './screens/AuthScreen'

jest.mock('./lib/api')
jest.mock('./context/AuthContext')
jest.mock('./hooks/use-push-token', () => () => 'dummy-expo-token')
jest.mock('./screens/AuthScreen.tsx')
jest.mock('expo-constants', () => ({
  ...jest.requireActual('expo-constants'),
  AppOwnership: {},
}))
jest.mock('expo-notifications', () => ({
  dismissNotificationAsync: jest.fn().mockResolvedValue(undefined),
  setNotificationHandler: jest.fn(),
}))

describe('Main', () => {
  it('should render AuthScreen for unauthenticated users', () => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
    })

    renderWithTheme(<Main />)

    expect(AuthScreen).toHaveBeenCalled()
  })
})
