import React from 'react'
import firebase from 'firebase'
import * as Google from 'expo-auth-session/providers/google'
import { fireEvent } from '@testing-library/react-native'

import Main from '../components/Main'

import { renderWithTheme } from './utils'

// This is mocked to silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')
jest.mock('expo-auth-session/providers/google')
jest.mock('firebase')

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
})
