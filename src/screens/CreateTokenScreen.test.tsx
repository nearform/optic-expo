import React from 'react'
import * as Notification from 'expo-notifications'
import { Subscription } from 'expo-modules-core'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'

import apiFactory from '../lib/api'
import { getMockedNavigation, renderWithTheme } from '../../test/utils'
import { Secret } from '../types'
import { MainStackParamList } from '../Main'

import { CreateTokenScreen } from './CreateTokenScreen'

const secret: Secret = {
  _id: 'id',
  secret: 'secret',
  uid: 'uid',
  tokens: [],
  account: 'account',
  issuer: '',
}

jest.mock('../lib/api')

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

jest.mock('../context/SecretsContext', () => {
  return {
    useSecrets: () => ({
      secrets: [secret],
      add: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    }),
    useSecretSelector: () => secret,
  }
})

describe('CreateTokenScreen', () => {
  const registerSubscriptionStub = jest.fn()
  const apiGenerateTokenStub = jest.fn()

  beforeEach(() => {
    ;(apiFactory as jest.Mock).mockReturnValue({
      registerSubscription: registerSubscriptionStub,
      generateToken: apiGenerateTokenStub,
    })
    ;(
      Notification.addNotificationResponseReceivedListener as jest.Mock
    ).mockReturnValue({} as Subscription)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const setup = () => {
    const props = {
      navigation: getMockedNavigation<'CreateToken'>(),
      route: { params: { secretId: secret._id } },
    } as unknown as NativeStackScreenProps<MainStackParamList, 'CreateToken'>

    return renderWithTheme(<CreateTokenScreen {...props} />)
  }

  it('registers subscription on load', async () => {
    setup()
    await waitFor(() => expect(registerSubscriptionStub).toBeCalledTimes(1))
    expect(registerSubscriptionStub).toBeCalledWith({
      token: 'dummy-expo-token',
      type: 'expo',
    })
  })

  it('generates a token when description inputted', async () => {
    const { getByLabelText, getByText } = setup()
    const descriptionInput = getByLabelText('Description')
    fireEvent.changeText(descriptionInput, 'A description')
    fireEvent.press(getByText('Create Token'))
    await waitFor(() => expect(apiGenerateTokenStub).toBeCalledTimes(1))
    expect(apiGenerateTokenStub).toBeCalledWith(secret, '')
  })
})
