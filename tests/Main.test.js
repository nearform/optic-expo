import React from 'react'
import firebase from 'firebase'
import * as Google from 'expo-auth-session/providers/google'
import { waitFor, fireEvent } from '@testing-library/react-native'

import Main from '../components/Main'
import { useSecrets } from '../context/secrets.js'

import { renderWithTheme } from './utils'

jest.mock('@expo-google-fonts/poppins', () => ({
  useFonts: jest.fn().mockReturnValue([true]),
}))

jest.mock('@expo-google-fonts/didact-gothic', () => ({
  useFonts: jest.fn().mockReturnValue([true]),
}))

jest.mock('expo-asset', () => ({
  useAssets: jest.fn().mockReturnValue([true]),
}))

jest.mock('expo-auth-session/providers/google', () => ({
  useIdTokenAuthRequest: jest.fn(),
}))

jest.mock('firebase', () => ({
  apps: [],
  initializeApp: jest.fn(),
  auth: jest.fn(),
}))

jest.mock('../context/secrets.js', () => ({
  ...jest.requireActual('../context/secrets.js'),
  useSecrets: jest.fn(() => ({
    isInitialized: true,
    secrets: [],
  })),
}))

describe('Main', () => {
  const promptAsync = jest.fn()

  const mockUseAuthRequest = response => {
    Google.useIdTokenAuthRequest.mockReturnValue([null, response, promptAsync])
  }

  const mockFirebaseAuthRequest = (
    onAuthStateChangedImplementation = jest.fn()
  ) => {
    firebase.auth.mockReturnValue({
      signOut: jest.fn(),
      signInWithCredential: jest.fn().mockResolvedValue({}),
      onAuthStateChanged: jest.fn(onAuthStateChangedImplementation),
    })
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render correct initial state for unauthenticated users', () => {
    mockFirebaseAuthRequest(() => jest.fn())

    mockUseAuthRequest(null)

    const { getByText, getByA11yLabel } = renderWithTheme({
      ui: <Main />,
    })

    getByText('Optic')
    getByText('Grant your favorite automated tools an OTP when they need it!')
    const login = getByA11yLabel('login')

    fireEvent.press(login)
    expect(promptAsync).toHaveBeenCalledTimes(1)
  })

  it('should render correct initial state for authenticated users', () => {
    mockFirebaseAuthRequest(callback => {
      callback({ name: 'user' })
      return jest.fn()
    })

    mockUseAuthRequest({
      type: 'success',
      params: {
        id_token: 'token',
      },
    })

    const { getByText, getByA11yLabel } = renderWithTheme({
      ui: <Main />,
    })

    getByText(`No Secrets`)
    getByText('Add a new secret and it will appear here.')
    const showActionsButton = getByA11yLabel('show-actions')
    fireEvent.press(showActionsButton)

    getByA11yLabel('Scan QR Code')
    getByA11yLabel('Upload')
    getByA11yLabel('Add details manually')
  })

  it('should allow an authenticated user to scan a QR code', async () => {
    const addSecretsMock = jest.fn()

    useSecrets.mockReturnValue({
      isInitialized: true,
      secrets: [],
      add: addSecretsMock,
    })

    mockUseAuthRequest({
      type: 'success',
      params: {
        id_token: 'token',
      },
    })

    mockFirebaseAuthRequest(callback => {
      callback({ name: 'user', uid: 'uid' })
      return jest.fn()
    })

    const { queryByText, getByA11yLabel } = renderWithTheme({
      ui: <Main />,
    })

    expect(queryByText('Your Tokens')).not.toBeNull()

    const showActionsButton = getByA11yLabel('show-actions')
    fireEvent.press(showActionsButton)

    const scanCodeButton = getByA11yLabel('Scan QR Code')
    fireEvent.press(scanCodeButton)

    await waitFor(() =>
      expect(addSecretsMock).toHaveBeenCalledWith({
        secret: 'mock-qr-secret',
        account: 'test',
        issuer: '',
        uid: 'uid',
      })
    )
  })
})
