import React from 'react'
import { StyleSheet, View } from 'react-native'

import AppBar from './AppBar'
import EmptyTokensText from './EmptyTokensText'
import Actions from './Actions'

import theme from '../defaultTheme'

export default function Home() {
  return (
    <View style={styles.container}>
      <AppBar />
      <EmptyTokensText />
      <Actions />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: theme.spacing(3),
    width: '100%',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
})
