import React from 'react'
import firebase from 'firebase'
import * as Google from 'expo-auth-session/providers/google'
import { waitFor, fireEvent } from '@testing-library/react-native'

import apiFactory from '../lib/api'
import { useAuthentication } from '../context/authentication'
import Main from '../Main'
import { useSecrets } from '../context/secrets.js'

import { renderWithTheme } from './utils'

jest.mock('@expo-google-fonts/poppins', () => ({
  useFonts: jest.fn().mockReturnValue([true]),
}))

jest.mock('@expo-google-fonts/didact-gothic', () => ({
  useFonts: jest.fn().mockReturnValue([true]),
}))

jest.mock('expo-auth-session/providers/google')

jest.mock('firebase')
jest.mock('expo-constants', () => ({
  manifest: { extra: { apiUrl: 'http://dummy.com/api' } },
}))

jest.mock('../lib/api.js')

jest.mock('../context/authentication', () => ({
  ...jest.requireActual('../context/authentication'),
  useAuthentication: jest.fn(),
}))

jest.mock('../hooks/use-push-token', () => () => 'dummy-expo-token')

jest.mock('../context/secrets.js', () => ({
  ...jest.requireActual('../context/secrets.js'),
  useSecrets: jest.fn(() => ({
    isInitialized: true,
    secrets: [],
  })),
}))

describe('Main', () => {
  let request
  let promptAsync
  const handleLoginStub = jest.fn()
  const registerSubscriptionStub = jest.fn()

  const mockUseAuthRequest = response => {
    return jest
      .spyOn(Google, 'useIdTokenAuthRequest')
      .mockReturnValue([request, response, promptAsync])
  }

  const mockFirebaseAuthRequest = () => {
    return jest.spyOn(firebase, 'auth').mockReturnValue({
      onAuthStateChanged: jest.fn(),
      signOut: jest.fn(),
      signInWithCredential: jest.fn().mockResolvedValue({}),
    })
  }

  beforeEach(() => {
    promptAsync = jest.fn()
    request = null
    mockFirebaseAuthRequest()
    useAuthentication.mockReturnValue({
      user: {}, // truthy
      loading: false,
      handleLogin: handleLoginStub,
    })
    apiFactory.mockReturnValue({
      registerSubscription: registerSubscriptionStub,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render correct initial state for unauthenticated users', () => {
    mockUseAuthRequest(null)
    useAuthentication.mockReturnValue({
      user: null,
      loading: false,
      handleLogin: handleLoginStub,
    })

    const { getByText, getByA11yLabel } = renderWithTheme({
      ui: <Main />,
    })

    getByText('Optic')
    getByText('Grant your favorite automated tools an OTP when they need it!')
    const login = getByA11yLabel('login')

    fireEvent.press(login)
    expect(handleLoginStub).toHaveBeenCalledTimes(1)
    expect(registerSubscriptionStub).toHaveBeenCalledTimes(0)
  })

  it('should render correct initial state for authenticated users', async () => {
    mockUseAuthRequest({
      type: 'success',
      params: {
        id_token: 'token',
      },
    })

    const getIdTokenMock = jest.fn().mockResolvedValue('id-token')

    firebase.auth().onAuthStateChanged = jest.fn(callback =>
      callback({
        name: 'user',
        getIdToken: getIdTokenMock,
      })
    )

    const { getByText, getByA11yLabel } = renderWithTheme({
      ui: <Main />,
    })

    await waitFor(() => expect(getIdTokenMock).toHaveBeenCalled())

    getByText(`No Secrets`)
    getByText('Add a new secret and it will appear here.')
    const showActionsButton = getByA11yLabel('show-actions')
    fireEvent.press(showActionsButton)

    getByA11yLabel('Scan QR Code')
    getByA11yLabel('Add details manually')

    expect(registerSubscriptionStub).toHaveBeenCalledTimes(1)
    expect(registerSubscriptionStub).toHaveBeenCalledWith({
      token: 'dummy-expo-token',
      type: 'expo',
    })
  })

  // TODO: bring it back when working on scan feature
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should allow an authenticated user to scan a QR code', async () => {
    const mockSecret = {
      secret: 'mock-qr-secret',
      account: 'test',
      issuer: '',
      uid: 'uid',
    }

    mockUseAuthRequest({
      type: 'success',
      params: {
        id_token: 'token',
      },
    })

    const addSecretsMock = jest.fn()

    useSecrets.mockReturnValue({
      isInitialized: true,
      secrets: [],
      add: addSecretsMock,
    })

    const getIdTokenMock = jest.fn().mockResolvedValue('id-token')

    firebase.auth().onAuthStateChanged = jest.fn(callback =>
      callback({
        name: 'user',
        uid: 'uid',
        getIdToken: getIdTokenMock,
      })
    )

    const { queryByText, getByA11yLabel } = renderWithTheme({
      ui: <Main />,
    })

    await waitFor(() => expect(getIdTokenMock).toHaveBeenCalled())

    expect(queryByText('Your Tokens')).not.toBeNull()

    const showActionsButton = getByA11yLabel('show-actions')
    fireEvent.press(showActionsButton)

    const scanCodeButton = getByA11yLabel('Scan QR Code')
    fireEvent.press(scanCodeButton)

    await waitFor(() => expect(addSecretsMock).toHaveBeenCalledWith(mockSecret))
  })
})
