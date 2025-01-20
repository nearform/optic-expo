import React from 'react'
import * as Notification from 'expo-notifications'
import { EventSubscription } from 'expo-modules-core'
import { act } from '@testing-library/react-native'

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
  useLastNotificationResponse: jest.fn(),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'undetermined' }),
  setNotificationChannelAsync: jest.fn(),
  AndroidImportance: { MAX: 7 },
}))

jest.mock('../lib/api')
jest.mock('../lib/otp', () => ({
  generate: jest.fn().mockReturnValue('009988'),
  timeRemaining: jest.fn().mockReturnValue('24'),
}))

jest.mock('../hooks/use-push-token', () => () => 'dummy-expo-token')

beforeAll(() => {
  jest.useFakeTimers()
})

afterAll(() => {
  jest.useRealTimers()
})

describe('HomeScreen', () => {
  const registerSubscriptionStub = jest.fn()

  beforeEach(() => {
    ;(apiFactory as jest.Mock).mockReturnValue({
      registerSubscription: registerSubscriptionStub,
    })
    ;(
      Notification.addNotificationResponseReceivedListener as jest.Mock
    ).mockReturnValue({} as EventSubscription)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const setup = () => {
    const navigation = getMockedNavigation()
    return renderWithTheme(<HomeScreen navigation={navigation} />)
  }

  it('should match snapshot when there are no secrets', async () => {
    const view = setup()
    await act(() => Promise.resolve())

    expect(view).toMatchSnapshot()
  })

  it('renders secret cards when available', async () => {
    ;(useSecrets as jest.Mock).mockReturnValue({
      secrets: [
        {
          _id: '111',
          account: 'Account 1',
          issuer: 'Some issuer',
          secret: 'my-secret',
          uid: '222',
          tokens: [{ token: 'some-token', description: 'A description' }],
        },
        {
          _id: '222',
          account: 'Account 1',
          issuer: 'Some issuer',
          secret: 'my-another-secret',
          uid: '222',
        },
      ],
      add: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
      replace: jest.fn(),
    })

    const view = setup()
    await act(() => Promise.resolve())

    expect(view).toMatchSnapshot()
  })
})
