import React from 'react'

import { getMockedNavigation, renderWithTheme } from '../../test/utils'

import { ExportFileSecret } from './ExportFileSecret'

describe('ExportFileSecret', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const setup = () => {
    const navigation = getMockedNavigation<'ExportFileSecret'>()
    return renderWithTheme(<ExportFileSecret navigation={navigation} />)
  }

  it('should match snapshot', () => {
    const view = setup()
    expect(view).toMatchSnapshot()
  })
})
