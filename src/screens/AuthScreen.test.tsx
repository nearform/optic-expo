import React from 'react'
import { isAvailableAsync } from 'expo-apple-authentication'
import { fireEvent } from '@testing-library/react-native'

import { renderWithTheme } from '../../test/utils'
import { useAuth } from '../context/AuthContext'

import { AuthScreen } from './AuthScreen'

jest.mock('../context/AuthContext')
jest.mock('../hooks/use-push-token', () => () => 'dummy-expo-token')
jest.mock('expo-apple-authentication', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(false),
}))

describe('AuthScreen', () => {
  beforeEach(() => {
    ;(useAuth as jest.Mock).mockReturnValue({})
  })

  it('should render correct initial state for unauthenticated users', () => {
    const handleLoginStub = jest.fn()

    ;(useAuth as jest.Mock).mockReturnValue({
      user: null,
      loading: false,
      handleLoginGoogle: handleLoginStub,
      handleLogout: jest.fn(),
    })

    const { getByText, getByLabelText } = renderWithTheme(<AuthScreen />)

    getByText('Optic')
    getByText('Grant your favorite automated tools an OTP when they need it!')
    const login = getByLabelText('login with google')

    fireEvent.press(login)
    expect(handleLoginStub).toHaveBeenCalledTimes(1)
  })

  describe('apple log sign in', () => {
    it('should hide apple sign in until we know it is available', async () => {
      const p = new Promise(() => {
        // do nothing
      })

      ;(isAvailableAsync as jest.Mock).mockReturnValue(p)

      const { queryAllByLabelText } = renderWithTheme(<AuthScreen />)

      const logins = queryAllByLabelText('login with apple')
      expect(logins.length).toBe(0)
    })

    it('should show apple sign in when it is available', async () => {
      ;(isAvailableAsync as jest.Mock).mockResolvedValue(true)

      const { findAllByLabelText } = renderWithTheme(<AuthScreen />)
      const logins = await findAllByLabelText('login with apple')
      expect(logins.length).toBe(1)
    })
  })
})
