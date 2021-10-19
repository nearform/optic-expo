export type Secret = {
  _id: string
  uid: string
  secret: string
  account: string
  issuer: string
  token?: string
}

export type Subscription = {
  type: 'expo'
  token: string
}
