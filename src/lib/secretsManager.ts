import { Optional } from 'utility-types'
import { v4 as uuid } from 'uuid'

import { Secret } from '../types'

import * as storage from './secure-storage'

const secretStorageKey = 'secrets'

const save = (secrets: Secret[]) => {
  return storage.saveObject(secretStorageKey, secrets)
}

const getAll = async () => {
  const secrets = (await storage.getObject<Secret[]>(secretStorageKey)) ?? []
  return secrets
}

const getAllByUser = async (userId: string) => {
  const secrets = (await storage.getObject<Secret[]>(secretStorageKey)) ?? []
  return secrets.filter(s => s.uid === userId)
}

const get = async (id: string, userId: string) => {
  const secrets = await getAllByUser(userId)
  return secrets.find(secret => secret._id === id)
}

/**
 * Add or update a secret to the list.
 * If not provided, an _id key will be generated
 * @async
 * @param {Object} secret - secret to upsert
 * @returns {Object} the added/updated secret
 */
const upsert = async (secret: Optional<Secret, '_id'>, userId: string) => {
  const secrets = await getAll()
  let upserted = secrets.find(s => s._id === secret._id && s.uid === userId)

  if (upserted) {
    Object.assign(upserted, secret)
  } else {
    upserted = { ...secret, _id: uuid() }
    secrets.push(upserted)
  }

  try {
    await save(secrets)
  } catch (err) {
    console.error('Failed to upsert secret into data store', err)
  }

  return upserted
}

/**
 * Remove a secret from the list. Does not fail if it can not be found.
 * @async
 * @param {string} secretId - removed secret id
 * @returns {void}
 */
const remove = async (secretId: string) => {
  const secrets = await getAll()

  try {
    await save(secrets.filter(s => s._id !== secretId))
  } catch (err) {
    console.error('Failed to remove secret from data store', err)
  }
}

/**
 * Replaces the secrets setting the input array as the new source for the secrets.
 * @param {Secret[]} secrets array with secrets
 * @returns {void}
 */
const replace = async secrets => {
  try {
    await save(secrets)
  } catch (err) {
    console.error('Failed to replace the secrets in the data store', err)
  }
}

export default { getAllByUser, get, upsert, remove, replace }
