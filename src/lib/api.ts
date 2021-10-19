import Constants from 'expo-constants'

import { Secret, Subscription } from '../types'

import otpLib from './otp'

const { apiUrl } = Constants.manifest?.extra as { apiUrl: string }

type APIOptions = {
  idToken: string
}

export default function apiFactory(opts: APIOptions) {
  return {
    async generateToken(secret: Secret) {
      const response = await fetch(`${apiUrl}/token/${secret._id}`, {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${opts.idToken}`,
        },
      })

      const { token } = await response.json()

      return token
    },

    async revokeToken(secret: Secret) {
      await fetch(`${apiUrl}/token/${secret._id}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${opts.idToken}`,
        },
      })
    },

    async getServerPublicKey() {
      const publicKeyResponse = await fetch(`${apiUrl}/vapidPublicKey`) // Why not secure??
      return publicKeyResponse.text()
    },

    async registerSubscription(subscription: Subscription) {
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
    async respond(secret: string, uniqueId: string, approved: boolean) {
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
