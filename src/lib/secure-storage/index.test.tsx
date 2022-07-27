import { setItem, getItem } from './storage'

import { saveObject, getObject } from './index'

jest.mock('./storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}))

describe('storage', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('saveObject to reject when exception occurs in setItem', async () => {
    ;(setItem as jest.Mock).mockRejectedValueOnce('setItem error')
    await expect(saveObject('foo', 'bar')).rejects.toEqual('setItem error')
  })

  it('getObject to return null when exception occurs in getItem', async () => {
    ;(getItem as jest.Mock).mockRejectedValueOnce('getItem error')
    await expect(getObject('foo')).resolves.toBeNull()
  })

  it('getObject to return null when exception occurs in JSON.parse', async () => {
    ;(getItem as jest.Mock).mockResolvedValueOnce('bad json')
    await expect(getObject('foo')).resolves.toBeNull()
  })
})
