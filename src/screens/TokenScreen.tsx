import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from 'react-native-paper'

import { useAuth } from '../context/AuthContext'
import { Typography } from '../components/Typography'
import { Secret } from '../types'
import apiFactory from '../lib/api'
import { useSecrets } from '../context/SecretsContext'
import usePushToken from '../hooks/use-push-token'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
  scrollView: {
    flexGrow: 1,
  },
})

export const TokenScreen = () => {
  const { user } = useAuth()
  const [subscriptionId, setSubscriptionId] = useState<string>('')
  const { update } = useSecrets()
  const expoToken = usePushToken()

  const api = useMemo(() => apiFactory({ idToken: user.idToken }), [user])

  const handleGenerateToken = async (secret: Secret) => {
    try {
      const token = await api.generateToken(secret, subscriptionId)
      await update({ ...secret, token })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (!user || !expoToken) return

    const register = async () => {
      const id = await api.registerSubscription({
        type: 'expo',
        token: expoToken,
      })
      setSubscriptionId(id)
    }

    register()
  }, [user, api, expoToken])

  return (
    <View style={styles.container}>
      <Typography>Hello world</Typography>
      <Button
        onPress={() => {
          console.log('Press')
        }}
      >
        Button
      </Button>
    </View>
  )
}
