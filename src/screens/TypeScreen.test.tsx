import React from 'react'
import { fireEvent } from '@testing-library/react-native'
import { getMockedNavigation, renderWithTheme } from '../../test/utils'
import { useSecrets } from '../context/SecretsContext'
import { TypeScreen } from './TypeScreen'

 
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
    const addStub = jest.fn();

    (useSecrets as jest.Mock).mockReturnValue({
      add: addStub,
    })

    const { getByA11yLabel } = setup()

    fireEvent.press(getByA11yLabel('Add secret'))

    expect(addStub).toHaveBeenCalledTimes(0)
  })

  it('calls add secret on button click', () => {
    const addStub = jest.fn();

    (useSecrets as jest.Mock).mockReturnValue({
      add: addStub,
    })

    const { getByA11yLabel } = setup()

    fireEvent.changeText(getByA11yLabel('Issuer'), 'Issuer A')
    fireEvent.changeText(getByA11yLabel('Secret'), 'mysecret')
    fireEvent.changeText(getByA11yLabel('Account'), 'My Account')

    fireEvent.press(getByA11yLabel('Add secret'))

    expect(addStub).toHaveBeenCalledTimes(1)
    expect(addStub).toHaveBeenCalledWith({
      account: 'My Account',
      issuer: 'Issuer A',
      secret: 'mysecret',
      uid: '11-22-33-44',
    })
  })
})
