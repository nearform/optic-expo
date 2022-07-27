import {
  writeAsStringAsync,
  readAsStringAsync,
  getInfoAsync,
} from 'expo-file-system'
import { getItemAsync, setItemAsync } from 'expo-secure-store'
const { setItem, getItem } = jest.requireActual('./storage')

jest.mock('expo-file-system')
jest.mock('expo-secure-store')

describe('storage', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    global.crypto = {
      getRandomValues: jest.fn().mockReturnValue(new Uint8Array(32)),
    }
    ;(getInfoAsync as jest.Mock).mockImplementation(() => ({ exists: true }))
  })

  it('setItem to reject when exception occurs in readAsStringAsync', async () => {
    ;(readAsStringAsync as jest.Mock).mockRejectedValueOnce(
      'readAsStringAsync error'
    )
    await expect(setItem('foo', 'bar')).rejects.toEqual(
      'readAsStringAsync error'
    )
  })

  it('setItem to reject when exception occurs in setItemAsync', async () => {
    ;(setItemAsync as jest.Mock).mockRejectedValueOnce('setItemAsync error')
    ;(readAsStringAsync as jest.Mock).mockReturnValueOnce(null)
    await expect(setItem('foo', 'bar')).rejects.toEqual('setItemAsync error')
  })

  it('setItem to reject when exception occurs in writeAsStringAsync', async () => {
    ;(setItemAsync as jest.Mock).mockResolvedValueOnce(undefined)
    ;(readAsStringAsync as jest.Mock).mockReturnValueOnce(null)
    ;(writeAsStringAsync as jest.Mock).mockRejectedValueOnce(
      'writeAsStringAsync error'
    )
    await expect(setItem('foo', 'bar')).rejects.toEqual(
      'writeAsStringAsync error'
    )
  })

  it('getItem to reject when exception occurs in readAsStringAsync', async () => {
    ;(readAsStringAsync as jest.Mock).mockRejectedValueOnce(
      'readAsStringAsync error'
    )
    await expect(getItem('foo')).rejects.toEqual('readAsStringAsync error')
  })

  it('getItem to reject when getItemAsync returns null', async () => {
    ;(readAsStringAsync as jest.Mock).mockResolvedValueOnce(
      'encrypted_storage_key'
    )
    ;(getItemAsync as jest.Mock).mockResolvedValueOnce(null)
    await expect(getItem('foo')).rejects.toEqual('Storage key not found')
  })

  it('getItem to reject when exception occurs in getItemAsync', async () => {
    ;(readAsStringAsync as jest.Mock).mockResolvedValueOnce(
      'encrypted_storage_key'
    )
    ;(getItemAsync as jest.Mock).mockRejectedValueOnce('getItemAsync error')
    await expect(getItem('foo')).rejects.toEqual('getItemAsync error')
  })
})
