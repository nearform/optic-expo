import React from 'react'
import { View, StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'

import theme from '../lib/defaultTheme'

import { Caption } from './typography'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    backgroundColor: theme.colors.onSurface,
    borderRadius: 4,
    padding: theme.spacing(0.75),
    opacity: 0.6,
  },
  secondaryButton: {
    borderRadius: 100,
    backgroundColor: theme.colors.surface,
  },
})

export default function IconButtonWithLabel({ onPress, label, icon }) {
  return (
    <View style={styles.container}>
      <View style={styles.label}>
        <Caption color={theme.colors.surface}>{label}</Caption>
      </View>

      <IconButton
        icon={icon}
        accessibilityLabel={label}
        mode="contained"
        style={styles.secondaryButton}
        size={30}
        color={theme.colors.primary}
        onPress={onPress}
      />
    </View>
  )
}
