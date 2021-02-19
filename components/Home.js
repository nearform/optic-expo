import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { useSecretsContext } from '../context/secrets'
import routes from '../lib/routeDefinitions'

import EmptyTokensText from './EmptyTokensText'
import Actions from './Actions'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    width: '100%',
  },
})

export default function Home() {
  const { navigate } = useNavigation()
  const { secrets } = useSecretsContext()

  return (
    <View style={styles.container}>
      {secrets.length === 0 && <EmptyTokensText />}
      <View>
        {secrets.length > 0 &&
          secrets.map(secret => (
            <Text key={secret._id}>{JSON.stringify(secret)}</Text>
          ))}
      </View>

      <Actions
        onScanNewSecretScreen={() => navigate(routes.scan.name)}
        onUploadNewSecretScreen={() => navigate(routes.upload.name)}
        onTypeNewSecretScreen={() => navigate(routes.type.name)}
      />
    </View>
  )
}
