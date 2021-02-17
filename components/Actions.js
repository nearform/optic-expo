import React from 'react'
import { View, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'

import theme from '../defaultTheme'

const A11Y_LABELS = {
  code: 'Add new secret by scanning a QR Code',
  upload: 'Add new secret by uploading a QR Code',
  add: 'Add new secret by filling the details',
}

export default function Actions() {
  return (
    <View style={styles.actions}>
      <IconButton
        icon="qrcode"
        accessibilityLabel={A11Y_LABELS.code}
        mode="contained"
        style={styles.button}
        size={40}
        color={theme.colors.white}
      />
      <IconButton
        icon="upload"
        accessibilityLabel={A11Y_LABELS.upload}
        mode="contained"
        style={styles.button}
        size={40}
        color={theme.colors.white}
      />
      <IconButton
        icon="import"
        accessibilityLabel={A11Y_LABELS.add}
        mode="contained"
        style={styles.button}
        size={40}
        color={theme.colors.white}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 100,
    backgroundColor: theme.colors.primary,
  },
})
