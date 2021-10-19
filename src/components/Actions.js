import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { FAB } from 'react-native-paper'

import theme from '../lib/defaultTheme'

const A11Y_LABELS = {
  scan: 'Scan QR Code',
  type: 'Add details manually',
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
})

export default function Actions({ onScan, onType }) {
  const [open, setOpen] = useState(false)
  const handleStateChange = ({ open: f }) => setOpen(f)

  return (
    <FAB.Group
      open={open}
      accessibilityLabel="show-actions"
      icon={open ? 'close' : 'plus'}
      fabStyle={styles.primaryButton}
      actions={[
        {
          icon: 'qrcode',
          label: A11Y_LABELS.scan,
          onPress: onScan,
        },
        {
          icon: 'pencil',
          label: A11Y_LABELS.type,
          onPress: onType,
        },
      ]}
      onStateChange={handleStateChange}
    />
  )
}
