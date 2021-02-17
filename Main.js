import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { View, StyleSheet } from 'react-native'

import { useAuthenticationContext } from './context/authentication'
import Auth from './components/Auth'
import Home from './components/Home'

export default function Main() {
  const { user } = useAuthenticationContext()
  return (
    <View style={styles.container}>
      {user ? <Home user={user} /> : <Auth />}
      <StatusBar style="auto" />
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
