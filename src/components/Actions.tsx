import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { FAB } from 'react-native-paper'

import theme from '../lib/theme'

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
})

const initialState = { open: false }

type ActionsProps = {
  onScan: () => void
  onType: () => void
  visible: boolean
}

export const Actions: React.FC<ActionsProps> = ({
  onScan,
  onType,
  visible = true,
}) => {
  const [{ open }, setOpen] = useState(initialState)

  return (
    <FAB.Group
      visible={visible}
      open={open}
      accessibilityLabel="show-actions"
      icon={open ? 'close' : 'plus'}
      fabStyle={styles.primaryButton}
      actions={[
        {
          icon: 'qrcode',
          label: 'Scan QR Code',
          onPress: onScan,
        },
        {
          icon: 'pencil',
          label: 'Add details manually',
          onPress: onType,
        },
      ]}
      onStateChange={setOpen}
    />
  )
}
