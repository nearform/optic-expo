import Constants from 'expo-constants'

import { Secret, Subscription } from '../types'

import otpLib from './otp'

const { apiUrl } = Constants.manifest?.extra as { apiUrl: string }

type APIOptions = {
  idToken: string
}

export type API = {
  generateToken: (_: Secret) => Promise<string>
  revokeToken: (_: Secret) => Promise<void>
  registerSubscription: (_: Subscription) => Promise<void>
  respond: (_: string, __: string, ___: boolean) => Promise<void>
}

export default function apiFactory(opts: APIOptions): API {
  return {
    async generateToken(secret, expoToken) {
      const response = await fetch(`${apiUrl}/token/${secret._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${opts.idToken}`,
        },
        body: JSON.stringify({ expoToken }),
      })

      const { token } = await response.json()

      return token
    },

    async revokeToken(secret) {
      await fetch(`${apiUrl}/token/${secret._id}`, {
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
      } catch (err) {
        console.log(err)
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
