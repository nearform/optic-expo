import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import React from 'react'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'ts-jest/utils'
import { Alert } from 'react-native'

import { getMockedNavigation, renderWithTheme } from '../../test/utils'
import { MainStackParamList } from '../Main'
import { Secret } from '../types'
import { useSecrets } from '../context/SecretsContext'
import apiFactory, { API } from '../lib/api'

import { TokenScreen } from './TokenScreen'

const secret: Secret = {
  _id: 'id',
  secret: 'secret',
  uid: 'uid',
  tokens: [
    {
      description: 'A description',
      token: 'a-token',
    },
  ],
  account: 'account',
  issuer: '',
}

jest.mock('../lib/api')
jest.mock('../hooks/use-push-token', () => () => 'dummy-expo-token')
jest.mock('../context/SecretsContext')

const useSecretsMocked = mocked(useSecrets)
const apiFactoryMocked = mocked(apiFactory)

// Continue after alert by clicking the confirm button
jest
  .spyOn(Alert, 'alert')
  .mockImplementation((title, message, callbackOrButtons) =>
    callbackOrButtons[1].onPress()
  )

describe('TokenScreen', () => {
  const updateSecretStub = jest.fn()
  const apiGenerateTokenStub = jest.fn()
  const apiRevokeTokenStub = jest.fn()
  const registerSubscriptionStub = jest.fn().mockResolvedValue('a-sub')

  beforeEach(() => {
    useSecretsMocked.mockReturnValue({
      secrets: [secret],
      add: jest.fn(),
      update: updateSecretStub,
      remove: jest.fn(),
      reset: jest.fn(),
      addAll: jest.fn(),
    })

    apiFactoryMocked.mockReturnValue({
      generateToken: apiGenerateTokenStub,
      revokeToken: apiRevokeTokenStub,
      registerSubscription: registerSubscriptionStub,
    } as unknown as API)
  })

  const setup = () => {
    const props = {
      navigation: getMockedNavigation<'Token'>(),
      route: {
        params: { secretId: secret._id, token: secret.tokens[0].token },
      },
    } as unknown as NativeStackScreenProps<MainStackParamList, 'Token'>

    return renderWithTheme(<TokenScreen {...props} />)
  }

  it('refreshes token', async () => {
    const { getByText } = setup()
    await waitFor(() => {
      expect(registerSubscriptionStub).toBeCalled()
    })
    fireEvent.press(getByText('REFRESH TOKEN'))
    expect(apiGenerateTokenStub).toBeCalledTimes(1)
  })

  it('revokes token', async () => {
    const { getByText } = setup()
    await waitFor(() => {
      expect(registerSubscriptionStub).toBeCalled()
    })
    fireEvent.press(getByText('REVOKE TOKEN'))
    expect(apiRevokeTokenStub).toBeCalledTimes(1)
  })

  it('saves description in the background', async () => {
    // Using fake timer as description saving is debounced
    jest.useFakeTimers()
    updateSecretStub.mockReset()
    const { getByA11yLabel } = setup()

    await waitFor(() => {
      expect(registerSubscriptionStub).toBeCalled()
    })

    const inputtedDescriptionText = 'An updated description'

    const descriptionInput = getByA11yLabel('Description')
    fireEvent.changeText(descriptionInput, inputtedDescriptionText)
    jest.runOnlyPendingTimers()

    expect(updateSecretStub).toBeCalledTimes(1)
    expect(updateSecretStub).toBeCalledWith({
      ...secret,
      tokens: [{ ...secret.tokens[0], description: inputtedDescriptionText }],
    })
  })

  it("doesn't save description if it's empty", () => {
    // Using fake timer as description saving is debounced
    jest.useFakeTimers()
    registerSubscriptionStub.mockReset()
    updateSecretStub.mockReset()
    const { getByA11yLabel } = setup()

    const descriptionInput = getByA11yLabel('Description')
    fireEvent.changeText(descriptionInput, '')

    jest.runOnlyPendingTimers()

    expect(updateSecretStub).toBeCalledTimes(0)
  })
})
