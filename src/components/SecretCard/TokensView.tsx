import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

type Props = {
  count: number
  onPress: () => void
}

export const TokensView = ({ count, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <View>
          <Text>TOKENS</Text>
          <Text>{count}</Text>
        </View>
        <View>
          <Text>SEE TOKENS</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
