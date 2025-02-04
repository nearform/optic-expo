import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { FAB } from 'react-native-paper'

import theme from '../lib/theme'

const styles = StyleSheet.create({
  fab: {
    backgroundColor: theme.colors.secondary,
  },
  fabLabel: {
    color: theme.colors.surface,
    fontSize: theme.typography.caption.fontSize,
  },
  fabLabelContainer: {
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
      color={theme.colors.primary}
      fabStyle={styles.fab}
      actions={[
        {
          icon: 'qrcode',
          label: 'Scan QR Code',
          labelStyle: styles.fabLabel,
          containerStyle: styles.fabLabelContainer,
          color: theme.colors.primary,
          onPress: onScan,
        },
        {
          icon: 'pencil',
          label: 'Add details manually',
          color: theme.colors.primary,
          labelStyle: styles.fabLabel,
          containerStyle: styles.fabLabelContainer,
          onPress: onType,
        },
      ]}
      onStateChange={setOpen}
    />
  )
}
