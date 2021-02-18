import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'

import theme from '../lib/defaultTheme'

import IconButtonWithLabel from './IconButtonWithLabel'

const A11Y_LABELS = {
  scan: 'Scan QR Code',
  upload: 'Upload',
  type: 'Add details manually',
}

export default function Actions({
  onScanNewSecretScreen,
  onUploadNewSecretScreen,
  onTypeNewSecretScreen,
}) {
  const [actionsVisible, setActionsVisible] = useState(false)
  return (
    <View style={styles.container}>
      {actionsVisible && (
        <View style={styles.actions}>
          <IconButtonWithLabel
            label={A11Y_LABELS.scan}
            icon="qrcode"
            onPress={onScanNewSecretScreen}
          />
          <IconButtonWithLabel
            label={A11Y_LABELS.upload}
            onPress={onUploadNewSecretScreen}
            icon="upload"
          />
          <IconButtonWithLabel
            label={A11Y_LABELS.type}
            onPress={onTypeNewSecretScreen}
            icon="import"
          />
        </View>
      )}
      <IconButton
        icon="plus"
        accessibilityLabel="show-actions"
        style={styles.primaryButton}
        size={40}
        color={theme.colors.surface}
        mode="contained"
        onPress={() => setActionsVisible(previousState => !previousState)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    marginHorizontal: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  actions: {
    alignItems: 'flex-end',
    paddingRight: theme.spacing(1),
  },
  primaryButton: {
    borderRadius: 100,
    backgroundColor: theme.colors.primary,
  },
})
