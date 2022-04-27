import { writeAsStringAsync, readAsStringAsync } from 'expo-file-system'
import { getItemAsync, setItemAsync } from 'expo-secure-store'
import { mocked } from 'ts-jest/utils'
const { setItem, getItem } = jest.requireActual('./storage')

jest.mock('expo-file-system', () => ({
  writeAsStringAsync: jest.fn(),
  getInfoAsync: jest.fn().mockReturnValue({ exists: true }),
  readAsStringAsync: jest.fn(),
}))

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
}))

global.crypto.getRandomValues = jest.fn().mockReturnValue(new Uint8Array(32))

const writeAsStringAsyncMocked = mocked(writeAsStringAsync)
const readAsStringAsyncMocked = mocked(readAsStringAsync)
const getItemAsyncMocked = mocked(getItemAsync)
const setItemAsyncMocked = mocked(setItemAsync)

describe('storage', () => {
  afterEach(() => {
    writeAsStringAsyncMocked.mockClear()
    readAsStringAsyncMocked.mockClear()
    getItemAsyncMocked.mockClear()
    setItemAsyncMocked.mockClear()
  })

  it('setItem to reject when exception occurs in readAsStringAsync', async () => {
    readAsStringAsyncMocked.mockRejectedValueOnce('readAsStringAsync error')
    await expect(setItem('foo', 'bar')).rejects.toEqual(
      'readAsStringAsync error'
    )
  })

  it('setItem to reject when exception occurs in setItemAsync', async () => {
    setItemAsyncMocked.mockRejectedValueOnce('setItemAsync error')
    readAsStringAsyncMocked.mockReturnValueOnce(null)
    await expect(setItem('foo', 'bar')).rejects.toEqual('setItemAsync error')
  })

  it('setItem to reject when exception occurs in writeAsStringAsync', async () => {
    setItemAsyncMocked.mockResolvedValueOnce()
    readAsStringAsyncMocked.mockReturnValueOnce(null)
    writeAsStringAsyncMocked.mockRejectedValueOnce('writeAsStringAsync error')
    await expect(setItem('foo', 'bar')).rejects.toEqual(
      'writeAsStringAsync error'
    )
  })

  it('getItem to reject when exception occurs in readAsStringAsync', async () => {
    readAsStringAsyncMocked.mockRejectedValueOnce('readAsStringAsync error')
    await expect(getItem('foo')).rejects.toEqual('readAsStringAsync error')
  })

  it('getItem to reject when getItemAsync returns null', async () => {
    readAsStringAsyncMocked.mockResolvedValueOnce('encrypted_storage_key')
    getItemAsyncMocked.mockResolvedValueOnce(null)
    await expect(getItem('foo')).rejects.toEqual('Storage key not found')
  })

  it('getItem to reject when exception occurs in getItemAsyncMocked', async () => {
    readAsStringAsyncMocked.mockResolvedValueOnce('encrypted_storage_key')
    getItemAsyncMocked.mockRejectedValueOnce('getItemAsync error')
    await expect(getItem('foo')).rejects.toEqual('getItemAsync error')
  })
})
