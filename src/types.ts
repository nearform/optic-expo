import { type Notification } from 'expo-notifications'

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

export type NotificationData = {
  secretId: string
  uniqueId: string
  token: string
}

export type OpticNotification = Notification & {
  date: number // timestamp in ms
  request: {
    content: {
      data: NotificationData
    }
  }
}
