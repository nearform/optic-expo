import React from 'react'
import * as Notification from 'expo-notifications'
import { Subscription } from 'expo-modules-core'

import apiFactory from '../lib/api'
import { getMockedNavigation, renderWithTheme } from '../../test/utils'
import { useSecrets } from '../context/SecretsContext'

import { HomeScreen } from './HomeScreen'

jest.mock('@react-navigation/core', () => ({
  useIsFocused: jest.fn().mockReturnValue(true),
}))

jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  addNotificationReceivedListener: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  removeNotificationSubscription: jest.fn(),
}))

jest.mock('../lib/api')
jest.mock('../lib/otp', () => ({
  generate: jest.fn().mockReturnValue('009988'),
  timeRemaining: jest.fn().mockReturnValue('24'),
}))

jest.mock('../hooks/use-push-token', () => () => 'dummy-expo-token')

describe('HomeScreen', () => {
  const registerSubscriptionStub = jest.fn()

  beforeEach(() => {
    ;(apiFactory as jest.Mock).mockReturnValue({
      registerSubscription: registerSubscriptionStub,
    })
    ;(
      Notification.addNotificationResponseReceivedListener as jest.Mock
    ).mockReturnValue({} as Subscription)
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

  it('renders secret cards when available', () => {
    ;(useSecrets as jest.Mock).mockReturnValue({
      secrets: [
        {
          _id: '111',
          account: 'Account 1',
          issuer: 'Some issuer',
          secret: 'mysecret',
          uid: '222',
          tokens: [{ token: 'some-token', description: 'A description' }],
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
      replace: jest.fn(),
    })

    const view = setup()

    expect(view).toMatchSnapshot()
  })
})
