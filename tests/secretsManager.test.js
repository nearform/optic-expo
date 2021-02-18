import AsyncStorage from '@react-native-async-storage/async-storage'

import { find, upsert, remove } from '../lib/secretsManager'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}))

afterEach(() => {
  jest.resetAllMocks()
})

describe('secretsManager module', () => {
  describe('find', () => {
    test('should return an empty list if no secrets are stored', async () => {
      AsyncStorage.getItem.mockResolvedValue(null)
      const secrets = await find()
      expect(secrets).toEqual([])
    })

    test('should find all stored secrets', async () => {
      AsyncStorage.getItem.mockResolvedValue(JSON.stringify([{ a: '0' }]))
      const secrets = await find()
      expect(secrets).toEqual([{ a: '0' }])
    })

    test('should find secrets matching a criteria', async () => {
      AsyncStorage.getItem.mockResolvedValue(
        JSON.stringify([{ a: '0' }, { a: '1' }])
      )
      const secrets = await find({ a: '1' })
      expect(secrets).toEqual([{ a: '1' }])
    })
  })

  describe('upsert', () => {
    test('should insert a new secret', async () => {
      AsyncStorage.getItem.mockResolvedValue(null)
      const secret = await upsert({ a: '0' })
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1)
      expect(secret).toHaveProperty('_id')
      expect(secret).toHaveProperty('a', '0')
    })

    test('should update an existing secret', async () => {
      AsyncStorage.getItem.mockResolvedValue(
        JSON.stringify([{ _id: '#', a: '0' }])
      )
      const secret = await upsert({ _id: '#', a: '1' })
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1)
      expect(secret).toEqual({ _id: '#', a: '1' })
    })
  })

  describe('remove', () => {
    test('should remove a secret', async () => {
      AsyncStorage.getItem.mockResolvedValue(
        JSON.stringify([{ _id: '#', a: '0' }])
      )
      const secret = await remove('#')
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1)
      expect(secret).toEqual({ _id: '#', a: '0' })
    })

    test('should return null if no secret match the passed id', async () => {
      AsyncStorage.getItem.mockResolvedValue(
        JSON.stringify([{ _id: '#', a: '0' }])
      )
      const secret = await remove('?')
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(1)
      expect(secret).toBeNull()
    })
  })
})
