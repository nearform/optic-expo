export type Token = {
  token: string
  description: string
}

export type Secret = {
  _id: string
  uid: string
  secret: string
  account: string
  issuer: string
  tokens?: Token[]
}

export type Subscription = {
  type: 'expo'
  token: string
}

export type User = {
  name: string | null
  email: string
  uid: string
  idToken: string
}
