import { setTimeout } from 'timers/promises'

import React from 'react'
import { isAvailableAsync } from 'expo-apple-authentication'

import { renderWithTheme } from '../../test/utils'
import { useAuth } from '../context/AuthContext'

import { AuthScreen } from './AuthScreen'

jest.mock('../context/AuthContext')
jest.mock('../hooks/use-push-token', () => () => 'dummy-expo-token')
jest.mock('expo-apple-authentication', () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
}))

describe('AuthScreen', () => {
  beforeEach(() => {
    ;(useAuth as jest.Mock).mockReturnValue({})
  })

  it('should hide apple sign in', () => {
    const { queryAllByLabelText } = renderWithTheme(<AuthScreen />)
    const logins = queryAllByLabelText('login with apple')
    expect(logins.length).toBe(0)
  })

  it('should show apple sign in', async () => {
    ;(isAvailableAsync as jest.Mock).mockReturnValue(Promise.resolve(true))

    const { queryAllByLabelText } = renderWithTheme(<AuthScreen />)
    await setTimeout(100)
    const logins = queryAllByLabelText('login with apple')
    expect(logins.length).toBe(1)
  })
})
