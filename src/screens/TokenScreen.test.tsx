import React from 'react'
import { mocked } from 'ts-jest/utils'
import * as Notification from 'expo-notifications'
import { Subscription } from '@unimodules/react-native-adapter'

import apiFactory, { API } from '../lib/api'
import { getMockedNavigation, renderWithTheme } from '../../test/utils'

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
  const registerSubscriptionStub = jest.fn()

  beforeEach(() => {
    apiFactoryMocked.mockReturnValue({
      registerSubscription: registerSubscriptionStub,
    } as unknown as API)

    addNotificationResponseReceivedListenerMocked.mockReturnValue(
      {} as Subscription
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const setup = () => {
    const navigation: any = getMockedNavigation<'Token'>()
    const route: any = { params: { token: 'a-token', secret: {} } }
    return renderWithTheme(
      <TokenScreen navigation={navigation} route={route} />
    )
  }

  it('register subscription on load', () => {
    setup()

    expect(registerSubscriptionStub).toHaveBeenCalledTimes(1)
    expect(registerSubscriptionStub).toHaveBeenCalledWith({
      token: 'dummy-expo-token',
      type: 'expo',
    })
  })
})
