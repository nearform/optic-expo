import React from 'react'

import { getMockedNavigation, renderWithTheme } from '../../test/utils'

import { SettingsScreen } from './SettingsScreen'

describe('SettingsScreen', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const setup = () => {
    const navigation = getMockedNavigation<'Settings'>()
    return renderWithTheme(<SettingsScreen navigation={navigation} />)
  }

  it('should match snapshot', () => {
    const view = setup()
    expect(view).toMatchSnapshot()
  })
})
