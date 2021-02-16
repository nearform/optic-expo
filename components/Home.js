import * as React from 'react'
import { Text } from 'react-native'

export default function Home({ user }) {
  return <Text>Hi, {user.displayName}!</Text>
}
