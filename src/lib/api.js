import Constants from 'expo-constants'

const { apiUrl } = Constants.manifest.extra

export default function apiFactory(opts) {
  return {
    async generateToken(secret) {
      const response = await fetch(`${apiUrl}/token/${secret._id}`, {
        method: 'PUT',
        headers: {
          authorization: `Bearer ${opts.idToken}`,
        },
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

    async getServerPublicKey() {
      const publicKeyResponse = await fetch(`${apiUrl}/vapidPublicKey`) // Why not secure??
      return publicKeyResponse.text()
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
  }
}
