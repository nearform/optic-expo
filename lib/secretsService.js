const apiUrl = 'https://optic-web.herokuapp.com/api'

export default class SecretsService {
  constructor(user) {
    this.userIdToken = user.idToken
  }

  async generateToken(secret) {
    const response = await fetch(`${apiUrl}/token/${secret._id}`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${this.userIdToken}`,
      },
    })

    const { token } = await response.json()

    return token
  }

  async revokeToken(secret) {
    await fetch(`${apiUrl}/token/${secret._id}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${this.userIdToken}`,
      },
    })
  }

  async getServerPublicKey() {
    const publicKeyResponse = await fetch(`${apiUrl}/vapidPublicKey`) // Why not secure??
    return publicKeyResponse.text()
  }

  async registerSubscription(subscription) {
    const response = await fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.userIdToken}`,
      },
      body: JSON.stringify(subscription),
    })

    if (!response.ok) {
      throw new Error('Cannot send subscription to server')
    }
  }
}
