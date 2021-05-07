const { API_URL } = process.env

export default class SecretsService {
  constructor(user) {
    this.userIdToken = user.idToken
  }

  async generateToken(secret) {
    const response = await fetch(`${API_URL}/token/${secret._id}`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${this.userIdToken}`,
      },
    })

    const { token } = await response.json()

    return token
  }

  async revokeToken(secret) {
    await fetch(`${API_URL}/token/${secret._id}`, {
      method: 'DELETE',
      headers: {
        authorization: `Bearer ${this.userIdToken}`,
      },
    })
  }

  async getServerPublicKey() {
    const publicKeyResponse = await fetch(`${API_URL}/vapidPublicKey`) // Why not secure??
    return publicKeyResponse.text()
  }

  async registerSubscription(subscription) {
    const response = await fetch(`${API_URL}/register`, {
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
