import React from 'react'
import { mocked } from 'ts-jest/utils'
import * as Notification from 'expo-notifications'
import { Subscription } from '@unimodules/react-native-adapter'
import { fireEvent } from '@testing-library/react-native'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'

import apiFactory, { API } from '../lib/api'
import { getMockedNavigation, renderWithTheme } from '../../test/utils'
import { Secret } from '../types'
import { MainStackParamList } from '../Main'

import { TokenScreen } from './TokenScreen'

jest.mock('@react-navigation/core', () => ({
  useIsFocused: jest.fn().mockReturnValue(true),
}))

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  removeNotificationSubscription: jest.fn(),
}))

jest.mock('../lib/api')
jest.mock('../lib/otp', () => ({
  generate: jest.fn().mockReturnValue('009988'),
  timeRemaining: jest.fn().mockReturnValue('24'),
}))

jest.mock('../hooks/use-push-token', () => () => 'dummy-expo-token')

const apiFactoryMocked = mocked(apiFactory)
const addNotificationResponseReceivedListenerMocked = mocked(
  Notification.addNotificationResponseReceivedListener
)

describe('TokenScreen', () => {
  const secret: Secret = {
    _id: 'id',
    secret: 'secret',
    uid: 'uid',
    tokens: [{ note: 'My note', token: '' }],
    account: 'account',
    issuer: '',
  }
  const registerSubscriptionStub = jest.fn()
  const generateTokenStub = jest.fn()

  beforeEach(() => {
    apiFactoryMocked.mockReturnValue({
      registerSubscription: registerSubscriptionStub,
      generateToken: generateTokenStub,
    } as unknown as API)

    addNotificationResponseReceivedListenerMocked.mockReturnValue(
      {} as Subscription
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const setup = (token?: string) => {
    const props = {
      navigation: getMockedNavigation<'Token'>(),
      route: { params: { token, secret } },
    } as unknown as NativeStackScreenProps<MainStackParamList, 'Token'>

    return renderWithTheme(<TokenScreen {...props} />)
  }

  it('register subscription on load', () => {
    setup()
    expect(registerSubscriptionStub).toHaveBeenCalledTimes(1)
    expect(registerSubscriptionStub).toHaveBeenCalledWith({
      token: 'dummy-expo-token',
      type: 'expo',
    })
  })

  it('generates a token when note inputted', async () => {
    const { getByA11yLabel, getByText } = setup()

    const noteInput = getByA11yLabel('Note')
    fireEvent.changeText(noteInput, 'My note')
    fireEvent.press(getByText('Generate Token'))
    expect(generateTokenStub).toBeCalledTimes(1)
    expect(generateTokenStub).toBeCalledWith(secret, '')
  })
})
