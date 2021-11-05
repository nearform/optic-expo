import React from 'react'
import { mocked } from 'ts-jest/utils'
import * as Notification from 'expo-notifications'
import { Subscription } from '@unimodules/react-native-adapter'

import apiFactory, { API } from '../lib/api'
import { getMockedNavigation, renderWithTheme } from '../../test/utils'
import { useSecrets } from '../context/SecretsContext'

import { HomeScreen } from './HomeScreen'

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

const useSecretsMocked = mocked(useSecrets)
const apiFactoryMocked = mocked(apiFactory)
const addNotificationResponseReceivedListenerMocked = mocked(
  Notification.addNotificationResponseReceivedListener
)

describe('HomeScreen', () => {
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
    const navigation = getMockedNavigation()
    return renderWithTheme(<HomeScreen navigation={navigation} />)
  }

  it('should match snapshot when there are no secrets', () => {
    const view = setup()

    expect(view).toMatchSnapshot()
  })

  it('register subscription on load', () => {
    setup()

    expect(registerSubscriptionStub).toHaveBeenCalledTimes(1)
    expect(registerSubscriptionStub).toHaveBeenCalledWith({
      token: 'dummy-expo-token',
      type: 'expo',
    })
  })

  it('renders secret cards when available', () => {
    useSecretsMocked.mockReturnValue({
      secrets: [
        {
          _id: '111',
          account: 'Account 1',
          issuer: 'Some issuer',
          secret: 'mysecret',
          uid: '222',
          token: 'some-token',
        },
        {
          _id: '222',
          account: 'Account 1',
          issuer: 'Some issuer',
          secret: 'myanothersecret',
          uid: '222',
        },
      ],
      add: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
      updateUserId: jest.fn(),
    })

    const view = setup()

    expect(view).toMatchSnapshot()
  })
})
