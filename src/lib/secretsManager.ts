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

const get = async (id: string) => {
  const secrets = await getAll()
  return secrets.find(secret => secret._id === id)
}

/**
 * Add or update a secret to the list.
 * If not provided, an _id key will be generated
 * @async
 * @param {Object} secret - secret to upsert
 * @returns {Object} the added/updated secret
 */
const upsert = async (secret: Optional<Secret, '_id'>) => {
  const secrets = await getAll()
  let upserted = secrets.find(s => s._id === secret._id)

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

export default { getAll, get, upsert, remove }
