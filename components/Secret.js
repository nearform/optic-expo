import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Button } from 'react-native-paper'

import theme from '../lib/defaultTheme'

const styles = StyleSheet.create({
  container: {
    margin: theme.spacing(2),
    borderColor: 'black',
  },
})

const UI_STRINGS = {
  generateTokenButtonLabel: 'Generate Token',
}

export default function Secret({ data, onGenerateToken }) {
  const handleGenerateTokenButtonPress = () => onGenerateToken(data)

  return (
    <View style={styles.container}>
      <Text key={data._id}>{JSON.stringify(data)}</Text>
      <Button mode="contained" onPress={handleGenerateTokenButtonPress}>
        {UI_STRINGS.generateTokenButtonLabel}
      </Button>
    </View>
  )
}
