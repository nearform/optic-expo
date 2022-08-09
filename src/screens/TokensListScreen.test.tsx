import React from 'react'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import { fireEvent } from '@testing-library/react-native'

import { getMockedNavigation, renderWithTheme } from '../../test/utils'
import { MainStackParamList } from '../Main'
import { Secret } from '../types'
import * as hooks from '../hooks/use-secret-selector'

import { TokensListScreen } from './TokensListScreen'

const secret: Secret = {
  _id: 'id',
  secret: 'secret',
  uid: 'uid',
  tokens: [],
  account: 'account',
  issuer: '',
}

jest.mock('@react-navigation/core', () => ({
  useIsFocused: jest.fn().mockReturnValue(true),
}))

describe('TokensListScreen', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    jest.spyOn(hooks, 'useSecretSelector').mockImplementation(() => secret)
  })

  const setup = () => {
    const props = {
      navigation: getMockedNavigation<'TokensList'>(),
      route: { params: { secretId: secret._id } },
    } as unknown as NativeStackScreenProps<MainStackParamList, 'TokensList'>
    return renderWithTheme(<TokensListScreen {...props} />)
  }

  it('should match snapshot when there are no tokens', () => {
    const view = setup()
    expect(view).toMatchSnapshot()
  })

  it('should display an empty list when there are no tokens', () => {
    const { getByText } = setup()
    expect(getByText('No Tokens')).toBeTruthy()
    expect(
      getByText('Create a new token and it will appear here.')
    ).toBeTruthy()
  })

  it('should display a list with two tokens when there are two tokens', () => {
    jest.spyOn(hooks, 'useSecretSelector').mockImplementation(() => ({
      ...secret,
      tokens: [
        { token: 'token1', description: 'description of token 1' },
        { token: 'token2', description: 'description of token 2' },
      ],
    }))

    const { queryByText } = setup()

    expect(queryByText('No Tokens')).toBeFalsy()
    expect(queryByText('description of token 1')).toBeTruthy()
    expect(queryByText('description of token 2')).toBeTruthy()
  })

  it('should be able to filter by description', () => {
    jest.spyOn(hooks, 'useSecretSelector').mockImplementation(() => ({
      ...secret,
      tokens: [
        { token: '17526hkkdoeuagk122', description: 'My github token' },
        { token: '17adsdsdakdoeuagk122', description: 'My NPM token' },
      ],
    }))

    const { queryByText, getByLabelText } = setup()

    const input = getByLabelText('Search')
    fireEvent.changeText(input, 'github')
    expect(queryByText('My github token')).toBeTruthy()
    expect(queryByText('My NPM token')).toBeFalsy()

    fireEvent.changeText(input, 'token')
    expect(queryByText('My github token')).toBeTruthy()
    expect(queryByText('My NPM token')).toBeTruthy()
  })

  it('should be able to filter by token', () => {
    jest.spyOn(hooks, 'useSecretSelector').mockImplementation(() => ({
      ...secret,
      tokens: [
        { token: '17526hkkdoeuagk122', description: 'My github token' },
        { token: '17adsdsdakdoeuagk122', description: 'My NPM token' },
      ],
    }))

    const { queryByText, getByLabelText } = setup()

    const input = getByLabelText('Search')
    fireEvent.changeText(input, 'hkkdoeuagk')
    expect(queryByText('My github token')).toBeTruthy()
    expect(queryByText('My NPM token')).toBeFalsy()

    fireEvent.changeText(input, '17')
    expect(queryByText('My github token')).toBeTruthy()
    expect(queryByText('My NPM token')).toBeTruthy()
  })
})
