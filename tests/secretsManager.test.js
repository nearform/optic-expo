import {
  isAvailableAsync,
  getItemAsync,
  setItemAsync,
  deleteItemAsync,
} from 'expo-secure-store'
import {
  getItem,
  setItem,
  removeItem,
} from '@react-native-async-storage/async-storage'

import SecretsManager from '../lib/secretsManager'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}))

jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn(),
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}))

let secretsManager

beforeEach(() => {
  secretsManager = new SecretsManager()
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('SecretsManager class', () => {
  describe('initialize instance method', () => {
    beforeEach(() => {
      jest
        .spyOn(secretsManager, 'generateEncryptionPassphrase')
        .mockReturnValue([])
      jest.spyOn(secretsManager, 'set').mockResolvedValue()
    })

    test('should store encryption passphrase', async () => {
      isAvailableAsync.mockResolvedValue(false)
      getItem.mockResolvedValue(null)
      setItem.mockResolvedValue()
      await secretsManager.initialize()
      expect(getItem).toHaveBeenCalledWith('encryptionPassphrase')
      expect(secretsManager.generateEncryptionPassphrase).toHaveBeenCalled()
      expect(setItem).toHaveBeenCalledWith('encryptionPassphrase', '[]')
      expect(secretsManager.set).toHaveBeenCalledWith([])
    })

    test('should store encryption passphrase securely', async () => {
      isAvailableAsync.mockResolvedValue(true)
      getItemAsync.mockResolvedValue(null)
      setItemAsync.mockResolvedValue()
      await secretsManager.initialize()
      expect(getItemAsync).toHaveBeenCalledWith('encryptionPassphrase')
      expect(secretsManager.generateEncryptionPassphrase).toHaveBeenCalled()
      expect(setItemAsync).toHaveBeenCalledWith('encryptionPassphrase', '[]')
      expect(secretsManager.set).toHaveBeenCalledWith([])
    })

    test('should retrieve stored encryption passphrase', async () => {
      isAvailableAsync.mockResolvedValue(false)
      getItem.mockResolvedValue('[]')
      await secretsManager.initialize()
      expect(getItem).toHaveBeenCalledWith('encryptionPassphrase')
      expect(secretsManager.encryptionPassphrase).toEqual([])
      expect(secretsManager.generateEncryptionPassphrase).not.toHaveBeenCalled()
      expect(setItem).not.toHaveBeenCalled()
      expect(secretsManager.set).not.toHaveBeenCalled()
    })

    test('should retrieve securely stored encryption passphrase', async () => {
      isAvailableAsync.mockResolvedValue(true)
      getItemAsync.mockResolvedValue('[]')
      await secretsManager.initialize()
      expect(getItemAsync).toHaveBeenCalledWith('encryptionPassphrase')
      expect(secretsManager.encryptionPassphrase).toEqual([])
      expect(secretsManager.generateEncryptionPassphrase).not.toHaveBeenCalled()
      expect(setItemAsync).not.toHaveBeenCalled()
      expect(secretsManager.set).not.toHaveBeenCalled()
    })
  })

  describe('generateEncryptionPassphrase instance method', () => {
    beforeEach(() => {
      global.crypto = { getRandomValues: jest.fn(value => value) }
    })

    test('should generate a functional encryption passphrase', () => {
      expect(secretsManager.generateEncryptionPassphrase()).toHaveLength(32)
      expect(global.crypto.getRandomValues).toHaveBeenCalled()
    })
  })

  describe('encrypt instance method', () => {
    test('should return the passed in secrets array as a hexadecimal string', () => {
      secretsManager.encryptionPassphrase = new Array(32)
      const encrypted = secretsManager.encrypt('[]')
      expect(typeof encrypted).toBe('string')
      expect(/[0-9a-fA-F]+/.test(encrypted)).toBe(true)
    })
  })

  describe('decrypt instance method', () => {
    test('should return the encrypted secrets as an array of secret objects', () => {
      secretsManager.encryptionPassphrase = new Array(32)
      const encrypted = secretsManager.encrypt('[]')
      const decrypted = secretsManager.decrypt(encrypted)
      expect(decrypted).toEqual('[]')
    })
  })

  describe('get instance method', () => {
    beforeEach(() => {
      jest.spyOn(secretsManager, 'decrypt').mockImplementation(value => value)
    })

    test('should return all stored secrets', async () => {
      getItem.mockResolvedValue('[]')
      const secrets = await secretsManager.get()
      expect(getItem).toHaveBeenCalledWith('secrets')
      expect(secretsManager.decrypt).toHaveBeenCalled()
      expect(secrets).toEqual([])
    })
  })

  describe('set instance method', () => {
    beforeEach(() => {
      jest.spyOn(secretsManager, 'encrypt').mockImplementation(value => value)
    })

    test('should overwrite all stored secrets', async () => {
      setItem.mockResolvedValue('ok')
      await expect(secretsManager.set([])).resolves.toBe('ok')
      expect(secretsManager.encrypt).toHaveBeenCalled()
      expect(setItem).toHaveBeenCalledWith('secrets', '[]')
    })
  })

  describe('find instance method', () => {
    beforeEach(() => {
      jest.spyOn(secretsManager, 'get')
    })

    test('should return an empty list if no secrets are stored', async () => {
      secretsManager.get.mockResolvedValue([])
      const secrets = await secretsManager.find()
      expect(secrets).toEqual([])
    })

    test('should find all stored secrets', async () => {
      secretsManager.get.mockResolvedValue([{ a: '0' }])
      const secrets = await secretsManager.find()
      expect(secrets).toEqual([{ a: '0' }])
    })

    test('should find secrets matching a criteria', async () => {
      secretsManager.get.mockResolvedValue([{ a: '0' }, { a: '1' }])
      const secrets = await secretsManager.find({ a: '1' })
      expect(secrets).toEqual([{ a: '1' }])
    })
  })

  describe('upsert', () => {
    beforeEach(() => {
      jest.spyOn(secretsManager, 'get')
      jest.spyOn(secretsManager, 'set').mockResolvedValue()
    })

    test('should insert a new secret', async () => {
      secretsManager.get.mockResolvedValue([])
      const secret = await secretsManager.upsert({ a: '0' })
      expect(secretsManager.set).toHaveBeenCalledTimes(1)
      expect(secret).toHaveProperty('_id')
      expect(secret).toHaveProperty('a', '0')
    })

    test('should update an existing secret', async () => {
      secretsManager.get.mockResolvedValue([{ _id: '#', a: '0' }])
      const secret = await secretsManager.upsert({ _id: '#', a: '1' })
      expect(secretsManager.set).toHaveBeenCalledTimes(1)
      expect(secret).toEqual({ _id: '#', a: '1' })
    })
  })

  describe('remove', () => {
    beforeEach(() => {
      jest.spyOn(secretsManager, 'get')
      jest.spyOn(secretsManager, 'set').mockResolvedValue()
    })

    test('should remove a secret', async () => {
      secretsManager.get.mockResolvedValue([{ _id: '#', a: '0' }])
      const secret = await secretsManager.remove('#')
      expect(secretsManager.set).toHaveBeenCalledTimes(1)
      expect(secret).toEqual({ _id: '#', a: '0' })
    })

    test('should return null if no secret match the passed id', async () => {
      secretsManager.get.mockResolvedValue([{ _id: '#', a: '0' }])
      const secret = await secretsManager.remove('?')
      expect(secretsManager.set).toHaveBeenCalledTimes(1)
      expect(secret).toBeNull()
    })
  })
})
