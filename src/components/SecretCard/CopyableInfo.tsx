import React from 'react'
import { IconButton } from 'react-native-paper'
import { StyleSheet, View } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import Toast from 'react-native-root-toast'

import { TypographyVariant } from '../../lib/theme'
import { Typography } from '../Typography'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

type CopyableInfoProps = {
  children: string
  typographyVariant: TypographyVariant
}

export const CopyableInfo: React.FC<CopyableInfoProps> = ({
  children,
  typographyVariant,
}) => {
  return (
    <View style={styles.row}>
      <View style={styles.textContainer}>
        <Typography variant={typographyVariant}>{children}</Typography>
      </View>
      <IconButton
        icon="content-copy"
        accessibilityLabel="copy-otp"
        size={20}
        onPress={() => {
          Clipboard.setString(children)
          Toast.show(`${children} copied to your clipboard`, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
          })
        }}
      />
    </View>
  )
}
