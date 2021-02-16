import React from 'react'
import { View, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'

import theme from '../lib/defaultTheme'

const A11Y_LABELS = {
  scan: 'Add new secret by scanning a QR Code',
  upload: 'Add new secret by uploading a QR Code',
  type: 'Add new secret by typing the details',
}

export default function Actions({
  onScanNewSecretScreen,
  onUploadNewSecretScreen,
  onTypeNewSecretScreen,
}) {
  return (
    <View style={styles.actions}>
      <IconButton
        icon="qrcode"
        accessibilityLabel={A11Y_LABELS.scan}
        mode="contained"
        style={styles.button}
        size={40}
        color={theme.colors.surface}
        onPress={onScanNewSecretScreen}
      />
      <IconButton
        icon="upload"
        accessibilityLabel={A11Y_LABELS.upload}
        mode="contained"
        style={styles.button}
        size={40}
        color={theme.colors.surface}
        onPress={onUploadNewSecretScreen}
      />
      <IconButton
        icon="import"
        accessibilityLabel={A11Y_LABELS.type}
        mode="contained"
        style={styles.button}
        size={40}
        color={theme.colors.surface}
        onPress={onTypeNewSecretScreen}
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
