import React from 'react'
import { IconButton } from 'react-native-paper'
import { StyleSheet, View, Text } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import Toast from 'react-native-root-toast'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 0,
    marginTop: -10,
  },
})

const CopyableInfo = ({ children, textCustomStyle }) => {
  return (
    <View style={styles.row}>
      <Text style={textCustomStyle}>{children}</Text>
      <IconButton
        style={styles.iconButton}
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

export default CopyableInfo
