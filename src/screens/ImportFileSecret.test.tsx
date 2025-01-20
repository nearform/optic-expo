import React from 'react'

import { getMockedNavigation, renderWithTheme } from '../../test/utils'

import { ImportFileSecret } from './ImportFileSecret'

describe('ImportFileSecret', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  const setup = () => {
    const navigation = getMockedNavigation<'ImportFileSecret'>()
    // const router=
    return renderWithTheme(
      <ImportFileSecret
        navigation={navigation}
        route={{ params: { fileContent: 'testFileContent' } }}
      />
    )
  }

  it('should match snapshot', () => {
    const view = setup()
    expect(view).toMatchSnapshot()
  })
})
