import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import React from 'react'
import { fireEvent } from '@testing-library/react-native'
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
      note: 'A description',
      token: 'a-token',
    },
  ],
  account: 'account',
  issuer: '',
}

jest.mock('../lib/api')
jest.mock('../hooks/use-push-token')
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

  beforeEach(() => {
    useSecretsMocked.mockReturnValue({
      secrets: [secret],
      add: jest.fn(),
      update: updateSecretStub,
      remove: jest.fn(),
    })
    apiFactoryMocked.mockReturnValue({
      generateToken: apiGenerateTokenStub,
      revokeToken: apiRevokeTokenStub,
    } as unknown as API)
  })

  const setup = () => {
    const props = {
      navigation: getMockedNavigation<'Token'>(),
      route: { params: { secret: secret, token: secret.tokens[0].token } },
    } as unknown as NativeStackScreenProps<MainStackParamList, 'Token'>

    return renderWithTheme(<TokenScreen {...props} />)
  }

  it('refreshes token', () => {
    const { getByText } = setup()
    fireEvent.press(getByText('REFRESH TOKEN'))
    expect(apiGenerateTokenStub).toBeCalledTimes(1)
  })

  it('revokes token', () => {
    const { getByText } = setup()
    fireEvent.press(getByText('REVOKE TOKEN'))
    expect(apiRevokeTokenStub).toBeCalledTimes(1)
  })

  it('saves description in the background', () => {
    updateSecretStub.mockReset()
    // Using fake timer as description saving is debounced
    const { getByA11yLabel } = setup()
    const inputtedDescriptionText = 'An updated description'

    const descriptionInput = getByA11yLabel('Description')
    fireEvent.changeText(descriptionInput, inputtedDescriptionText)
    jest.runOnlyPendingTimers()

    expect(updateSecretStub).toBeCalledTimes(1)
    expect(updateSecretStub).toBeCalledWith({
      ...secret,
      tokens: [{ ...secret.tokens[0], note: inputtedDescriptionText }],
    })
  })

  it("doesn't save description if it's empty", () => {
    updateSecretStub.mockReset()
    // Using fake timer as description saving is debounced
    const { getByA11yLabel } = setup()

    const descriptionInput = getByA11yLabel('Description')
    fireEvent.changeText(descriptionInput, '')
    jest.runOnlyPendingTimers()

    expect(updateSecretStub).toBeCalledTimes(0)
  })
})
