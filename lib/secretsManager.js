import { v4 as uuid } from 'uuid'
import aesjs from 'aes-js'
import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'

const encryptionPassphraseStorageKey = 'encryptionPassphrase'
const secretStorageKey = 'secrets'

export default class SecretsManager {
  constructor() {
    this.encryptionPassphrase = null
  }

  async initialize() {
    const [
      getEncryptionPassphrase,
      setEncryptionPassphrase,
    ] = (await SecureStore.isAvailableAsync())
      ? [SecureStore.getItemAsync, SecureStore.setItemAsync]
      : [AsyncStorage.getItem, AsyncStorage.setItem]

    const encryptionPassphrase = await getEncryptionPassphrase(
      encryptionPassphraseStorageKey
    )

    if (encryptionPassphrase) {
      this.encryptionPassphrase = JSON.parse(encryptionPassphrase)
      return
    }

    this.encryptionPassphrase = this.generateEncryptionPassphrase()

    await setEncryptionPassphrase(
      encryptionPassphraseStorageKey,
      JSON.stringify(this.encryptionPassphrase)
    )

    await this.set([])
  }

  generateEncryptionPassphrase() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
  }

  encrypt(secrets) {
    const secretsBytes = aesjs.utils.utf8.toBytes(secrets)
    const aesCtr = new aesjs.ModeOfOperation.ctr(
      Uint8Array.from(this.encryptionPassphrase),
      new aesjs.Counter(5)
    )
    const encryptedBytes = aesCtr.encrypt(secretsBytes)
    return aesjs.utils.hex.fromBytes(encryptedBytes)
  }

  decrypt(encryptedSecrets) {
    const encryptedBytes = aesjs.utils.hex.toBytes(encryptedSecrets)
    const aesCtr = new aesjs.ModeOfOperation.ctr(
      Uint8Array.from(this.encryptionPassphrase),
      new aesjs.Counter(5)
    )
    const decryptedBytes = aesCtr.decrypt(encryptedBytes)
    return aesjs.utils.utf8.fromBytes(decryptedBytes)
  }

  async get() {
    const encrypted = await AsyncStorage.getItem(secretStorageKey)
    return JSON.parse(this.decrypt(encrypted))
  }

  async set(secrets) {
    return AsyncStorage.setItem(
      secretStorageKey,
      this.encrypt(JSON.stringify(secrets))
    )
  }

  /**
   * Find all secrets, applying a selector if provided.
   * When provided, all where clause must be fulfilled (logical AND).
   * By default, returns all secrets
   * @async
   * @param {Object} where - hash of where clauses returned secrets must fulfill with
   * @returns {Array<Object>} list (may be empty) of matching secrets
   */
  async find(where = {}) {
    let secrets = []

    try {
      const whereClauses = Object.keys(where)
      secrets = (await this.get()).filter(secret =>
        whereClauses.every(clause => secret[clause] === where[clause])
      )
    } catch (err) {
      console.error('Failed to read secrets from data store', err)
    }

    return secrets
  }

  /**
   * Add or update a secret to the list.
   * If not provided, an _id key will be generated
   * @async
   * @param {Object} secret - secret to upsert
   * @returns {Object} the added/updated secret
   */
  async upsert(secret) {
    const secretId = secret._id || uuid()
    const secrets = await this.get()
    let upserted = secrets.find(({ _id }) => _id === secretId)

    if (upserted) {
      Object.assign(upserted, secret)
    } else {
      upserted = { _id: secretId, ...secret }
      secrets.push(upserted)
    }

    try {
      await this.set(secrets)
    } catch (err) {
      console.error('Failed to upsert secret into data store', err)
    }

    return upserted
  }

  /**
   * Remove a secret from the list. Does not fail if it can not be found.
   * @async
   * @param {String} secretId - removed secret id
   * @returns {Object} the removed secret (may be null)
   */
  async remove(secretId) {
    const secrets = await this.get()
    const idx = secrets.findIndex(({ _id }) => _id === secretId)
    let removed = null

    if (idx !== -1) {
      removed = secrets.splice(idx, 1)[0]
    }

    try {
      await this.set(secrets)
    } catch (err) {
      console.error('Failed to remove secret from data store', err)
    }

    return removed
  }
}
