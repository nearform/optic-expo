import React from 'react'
import { mocked } from 'ts-jest/utils'
import { fireEvent } from '@testing-library/react-native'

import { renderWithTheme } from '../test/utils'

import apiFactory, { API } from './lib/api'
import { useAuth } from './context/AuthContext'
import Main from './Main'
import { User } from './types'

jest.mock('./lib/api')

jest.mock('./hooks/use-push-token', () => () => 'dummy-expo-token')

const useAuthMocked = mocked(useAuth)
const apiFactoryMocked = mocked(apiFactory)

describe('Main', () => {
  const handleLoginStub = jest.fn()
  const registerSubscriptionStub = jest.fn()

  beforeEach(() => {
    useAuthMocked.mockReturnValue({
      user: {} as User,
      loading: false,
      handleLogin: handleLoginStub,
      handleLogout: jest.fn(),
    })

    apiFactoryMocked.mockReturnValue({
      registerSubscription: registerSubscriptionStub,
    } as unknown as API)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render correct initial state for unauthenticated users', () => {
    useAuthMocked.mockReturnValue({
      user: null,
      loading: false,
      handleLogin: handleLoginStub,
      handleLogout: jest.fn(),
    })

    const { getByText, getByA11yLabel } = renderWithTheme(<Main />)

    getByText('Optic')
    getByText('Grant your favorite automated tools an OTP when they need it!')
    const login = getByA11yLabel('login')

    fireEvent.press(login)
    expect(handleLoginStub).toHaveBeenCalledTimes(1)
    expect(registerSubscriptionStub).toHaveBeenCalledTimes(0)
  })
})
