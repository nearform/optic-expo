import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { getMockedNavigation, renderWithTheme } from '../../test/utils'
import * as secretsContext from '../context/SecretsContext'

import { TypeScreen } from './TypeScreen'

const addStub = jest.fn()

jest.spyOn(secretsContext, 'useSecrets').mockReturnValue({
  add: addStub,
  remove: jest.fn(),
  replace: jest.fn(),
  secrets: [],
  secretsLoading: false,
  update: jest.fn(),
})

describe('TypeScreen', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const setup = () => {
    const navigation = getMockedNavigation<'Type'>()
    return renderWithTheme(<TypeScreen navigation={navigation} />)
  }

  it('should match snapshot', () => {
    const view = setup()

    expect(view).toMatchSnapshot()
  })

  it('does not allow adding secret on button click when input is empty', () => {
    const { getByLabelText } = setup()

    fireEvent.press(getByLabelText('Add secret'))

    expect(addStub).toHaveBeenCalledTimes(0)
  })

  it('calls add secret on button click', () => {
    const { getByLabelText } = setup()

    fireEvent.changeText(getByLabelText('Issuer'), 'Issuer A')
    fireEvent.changeText(getByLabelText('Secret'), 'mysecret')
    fireEvent.changeText(getByLabelText('Account'), 'My Account')

    fireEvent.press(getByLabelText('Add secret'))

    expect(addStub).toHaveBeenCalledTimes(1)
    expect(addStub).toHaveBeenCalledWith({
      account: 'My Account',
      issuer: 'Issuer A',
      secret: 'MYSECRET',
      uid: '11-22-33-44',
    })
  })

  describe('when malformed secret has been input', () => {
    describe('when it contains un-authorised digits', () => {
      beforeEach(() => {
        const { getByLabelText } = setup()

        fireEvent.changeText(getByLabelText('Issuer'), 'Issuer A')
        fireEvent.changeText(getByLabelText('Secret'), 'mysecret!1')
        fireEvent.changeText(getByLabelText('Account'), 'My Account')
      })

      it('should show an error message', () => {
        const { getByText } = screen

        expect(getByText('Invalid secret')).toBeDefined()
      })

      it('should keep the submit button disabled', () => {
        const { getByLabelText } = screen

        expect(getByLabelText('Add secret')).toBeDisabled()
      })
    })
  })

  describe('when it contains white spaces', () => {
    beforeEach(() => {
      const { getByLabelText } = setup()

      fireEvent.changeText(getByLabelText('Issuer'), 'Issuer A')
      fireEvent.changeText(getByLabelText('Secret'), 'my secret  is bad')
      fireEvent.changeText(getByLabelText('Account'), 'My Account')
    })

    it('should not show an error message', () => {
      const { queryByText } = screen

      expect(queryByText('Invalid secret')).toBeNull()
    })

    it('should enable the submit button', () => {
      const { getByLabelText } = screen

      expect(getByLabelText('Add secret')).toBeEnabled()
    })

    it('should store a compliant secret on submit', () => {
      const { getByLabelText } = screen

      fireEvent.press(getByLabelText('Add secret'))

      expect(addStub).toHaveBeenCalledTimes(1)
      expect(addStub).toHaveBeenCalledWith({
        account: 'My Account',
        issuer: 'Issuer A',
        secret: 'MYSECRETISBAD',
        uid: '11-22-33-44',
      })
    })
  })
})
