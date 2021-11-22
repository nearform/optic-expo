import React from 'react'
import { IconButton } from 'react-native-paper'
import { StyleSheet, View, Text, StyleProp, TextStyle } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import Toast from 'react-native-root-toast'

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
  textStyle: StyleProp<TextStyle>
}

export const CopyableInfo: React.FC<CopyableInfoProps> = ({
  children,
  textStyle,
}) => {
  return (
    <View style={styles.row}>
      <View style={styles.textContainer}>
        <Text style={textStyle}>{children}</Text>
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
