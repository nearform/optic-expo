import React from 'react'
import 'react-native-gesture-handler/jestSetup'
import firebase from 'firebase'
import * as Google from 'expo-auth-session/providers/google'
import { act, fireEvent } from '@testing-library/react-native'

import Main from '../components/Main'

import { renderWithTheme } from './utils'

// This is mocked to silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')
jest.mock('expo-auth-session/providers/google')
jest.mock('firebase')
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock')
  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {}

  return Reanimated
})

describe('Main', () => {
  let request
  let promptAsync

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
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render correct initial state for unauthenticated users', () => {
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
    mockUseAuthRequest({
      type: 'success',
      params: {
        id_token: 'token',
      },
    })

    firebase.auth().onAuthStateChanged = jest.fn(callback =>
      callback({ name: 'user' })
    )

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
    const mockSecret = `{"_id":0,"secret":"mock-qr-secret","account":"test","issuer":""}`

    mockUseAuthRequest({
      type: 'success',
      params: {
        id_token: 'token',
      },
    })

    firebase.auth().onAuthStateChanged = jest.fn(callback =>
      callback({ name: 'user' })
    )

    const {
      queryByText,
      getByA11yLabel,
      queryByA11yLabel,
      getByText,
    } = renderWithTheme({
      ui: <Main />,
    })

    expect(queryByText('Your Tokens')).not.toBeNull()

    const showActionsButton = getByA11yLabel('show-actions')
    fireEvent.press(showActionsButton)

    const scanCodeButton = getByA11yLabel('Scan QR Code')
    // await any async work e.g - requesting permissions,
    // simulating native scan event
    await act(async () => {
      fireEvent.press(scanCodeButton)
    })

    // The scanned secret should now appear on the home page
    expect(queryByText('No Secrets')).toBeNull()
    expect(queryByA11yLabel('Scan QR Code')).toBeNull()
    getByText(mockSecret)
  })
})
