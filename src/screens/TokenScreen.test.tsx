import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { mocked } from 'ts-jest/utils'

import { getMockedNavigation, renderWithTheme } from '../../test/utils'
import { MainStackParamList } from '../Main'
import { Secret } from '../types'
import { useSecrets } from '../context/SecretsContext'

import { TokenScreen } from './TokenScreen'

const secret: Secret = {
  _id: 'id',
  secret: 'secret',
  uid: 'uid',
  tokens: [
    {
      note: 'My note',
      token: 'a-token',
    },
  ],
  account: 'account',
  issuer: '',
}

jest.mock('../hooks/use-push-token')
jest.mock('../context/SecretsContext')
const useSecretsMocked = mocked(useSecrets)

describe('TokenScreen', () => {
  const updateSecretStub = jest.fn()

  beforeEach(() => {
    useSecretsMocked.mockReturnValue({
      secrets: [secret],
      add: jest.fn(),
      update: updateSecretStub,
      remove: jest.fn(),
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  const setup = () => {
    const props = {
      navigation: getMockedNavigation<'Token'>(),
      route: { params: { secret: secret, token: secret.tokens[0].token } },
    } as unknown as NativeStackScreenProps<MainStackParamList, 'Token'>

    return renderWithTheme(<TokenScreen {...props} />)
  }

  it('saves description in the background', () => {
    // Using fake timer as description saving is debounced
    jest.useFakeTimers()
    const { getByA11yLabel } = setup()
    const inputtedDescriptionText = 'a description'

    const descriptionInput = getByA11yLabel('Description')
    fireEvent.changeText(descriptionInput, inputtedDescriptionText)
    jest.runAllTimers()

    expect(updateSecretStub).toBeCalledTimes(1)
    expect(updateSecretStub).toBeCalledWith({
      ...secret,
      tokens: [{ ...secret.tokens[0], note: inputtedDescriptionText }],
    })
  })

  it("doesn't save description if it's empty", () => {
    // Using fake timer as description saving is debounced
    jest.useFakeTimers()
    const { getByA11yLabel } = setup()

    const descriptionInput = getByA11yLabel('Description')
    fireEvent.changeText(descriptionInput, '')
    jest.runAllTimers()

    expect(updateSecretStub).toBeCalledTimes(0)
  })
})
