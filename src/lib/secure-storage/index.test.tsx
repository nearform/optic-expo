import { mocked } from 'ts-jest/utils'

import { setItem, getItem } from './storage'
const { saveObject, getObject } = jest.requireActual('./index')

jest.mock('./storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
}))

const getItemMocked = mocked(getItem)
const setItemMocked = mocked(setItem)

describe('storage', () => {
  afterEach(() => {
    getItemMocked.mockClear()
    setItemMocked.mockClear()
  })

  it('saveObject to reject when exception occurs in setItem', async () => {
    setItemMocked.mockRejectedValueOnce('setItem error')
    await expect(saveObject('foo', 'bar')).rejects.toEqual('setItem error')
  })

  it('getObject to return null when exception occurs in getItem', async () => {
    getItemMocked.mockRejectedValueOnce('getItem error')
    await expect(getObject('foo')).resolves.toBeNull()
  })

  it('getObject to return null when exception occurs in JSON.parse', async () => {
    getItemMocked.mockResolvedValueOnce('bad json')
    await expect(getObject('foo')).resolves.toBeNull()
  })
})
