import React from 'react'
import { View, StyleSheet } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'

import { useAuth } from '../context/AuthContext'
import { useSecrets } from '../context/SecretsContext'
import { parse } from '../lib/qrParser'
import { MainStackParamList } from '../Main'
import Scanner from '../components/Scanner'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
})

type ScanScreenProps = {
  navigation: StackNavigationProp<MainStackParamList, 'Scan'>
}

export const ScanScreen: React.FC<ScanScreenProps> = ({ navigation }) => {
  const { user } = useAuth()
  const { add } = useSecrets()

  const handleBarCodeScanned = async (data: string) => {
    try {
      const { issuer, account, secret } = await parse(data)
      await add({ uid: user.uid, secret, account, issuer })
      navigation.navigate('Home')
    } catch (error) {
      // TODO: Handle error UI state
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      <Scanner onScan={handleBarCodeScanned} />
    </View>
  )
}
