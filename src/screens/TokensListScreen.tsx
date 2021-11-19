import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import React, { useState } from 'react'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import { FAB, TextInput } from 'react-native-paper'

import { MainStackParamList } from '../Main'
import theme from '../lib/theme'

const styles = StyleSheet.create({
  // container: {
  //   flexGrow: 1,
  //   justifyContent: 'flex-start',
  //   width: '100%',
  // },
  scrollView: {
    flexGrow: 1,
  },
  tokenItem: {
    padding: theme.spacing(2),
  },
})

type Props = NativeStackScreenProps<MainStackParamList, 'TokensList'>

export const TokensListScreen = ({ route, navigation }: Props) => {
  const { secret } = route.params
  const tokensCount = secret.tokens.length

  const [search, setSearch] = useState('')

  return (
    <>
      <View>
        <View>
          <Text>
            {tokensCount} <Text>{tokensCount === 1 ? 'TOKEN' : 'TOKENS'}</Text>
          </Text>
        </View>
        <View>
          <TextInput
            textAlign="left"
            label="Search"
            accessibilityLabel="Search"
            mode="outlined"
            value={search}
            onChangeText={setSearch}
            autoFocus
          />
        </View>
        <ScrollView style={styles.scrollView}>
          {secret.tokens.map(({ token, note }) => (
            <TouchableOpacity
              key={token}
              onPress={() => navigation.navigate('Token', { secret, token })}
            >
              <View style={styles.tokenItem}>
                <View>
                  <Text>{token}</Text>
                </View>
                <View>
                  <Text>{note}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FAB icon="plus" />
    </>
  )
}
