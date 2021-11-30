import { ActivityIndicator, Portal } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import React from 'react'

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0, 0.75)',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export const LoadingSpinnerOverlay = () => {
  return (
    <Portal>
      <View style={styles.container}>
        <ActivityIndicator animating={true} size="large" color="white" />
      </View>
    </Portal>
  )
}
