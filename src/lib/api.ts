import Constants from 'expo-constants'

import { Secret, Subscription } from '../types'

import otpLib from './otp'

const { apiUrl } =
  Constants.expoConfig?.extra || ({ apiUrl: '' } as { apiUrl: string })

type APIOptions = {
  idToken: string
}

export type API = {
  generateToken: (_: Secret, __: string, ___?: string) => Promise<string>
  deleteSecret: (_: Secret) => Promise<void>
  revokeToken: (_: string) => Promise<void>
  registerSubscription: (_: Subscription) => Promise<string>
  respond: (_: string, __: string, ___: boolean) => Promise<void>
}

export default function apiFactory(opts: APIOptions): API {
  return {
    async generateToken(secret, subscriptionId, existingToken) {
      const response = await fetch(`${apiUrl}/token`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${opts.idToken}`,
        },
        body: JSON.stringify({
          secretId: secret._id,
          subscriptionId,
          existingToken,
        }),
      })

      if (!response.ok) {
        throw new Error('There was an issue connecting to the server')
      }

      const { token } = await response.json()

      return token
    },
    async deleteSecret(secret) {
      await fetch(`${apiUrl}/secret/${secret._id}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${opts.idToken}`,
        },
      })
    },
    async revokeToken(token) {
      await fetch(`${apiUrl}/token/${token}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${opts.idToken}`,
        },
      })
    },

    async registerSubscription(subscription) {
      try {
        const response = await fetch(`${apiUrl}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${opts.idToken}`,
          },
          body: JSON.stringify(subscription),
        })

        if (!response.ok) {
          throw new Error('Cannot send subscription to server')
        }

        const data = await response.json()

        return data.subscriptionId
      } catch (err) {
        console.log(err)
        throw err
      }
    },

    async respond(secret, uniqueId, approved) {
      try {
        const response = await fetch(`${apiUrl}/respond`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            approved,
            uniqueId,
            otp: approved ? otpLib.generate(secret) : undefined,
          }),
        })

        if (!response.ok) {
          throw new Error('Could not respond to server')
        }
      } catch (err) {
        console.log(err)
      }
    },
  }
}
