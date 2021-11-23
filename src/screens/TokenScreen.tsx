import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import Toast from 'react-native-root-toast'

import { useAuth } from '../context/AuthContext'
import apiFactory from '../lib/api'
import { useSecrets } from '../context/SecretsContext'
import usePushToken from '../hooks/use-push-token'
import { MainStackParamList } from '../Main'
import theme from '../lib/theme'
import { Typography } from '../components/Typography'
import { CopyableInfo } from '../components/SecretCard/CopyableInfo'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing(3),
    paddingTop: theme.spacing(4),
  },
  token: {
    marginBottom: theme.spacing(4),
  },
  tokenText: {
    fontFamily: 'monospace',
    fontSize: 24,
    color: theme.colors.text,
  },
  description: {
    marginBottom: theme.spacing(4),
  },
  refresh: {
    marginBottom: theme.spacing(4),
  },
  refreshButton: {
    marginBottom: theme.spacing(1),
  },
})

type Props = NativeStackScreenProps<MainStackParamList, 'Token'>

export const TokenScreen = ({ route, navigation }: Props) => {
  const { secret, token } = route.params
  const existingNote =
    secret.tokens?.find(item => item.token === token)?.note || ''
  const { user } = useAuth()
  const [subscriptionId, setSubscriptionId] = useState<string>('')
  const [note, setNote] = useState(existingNote)
  const { update } = useSecrets()
  const expoToken = usePushToken()

  const api = useMemo(() => apiFactory({ idToken: user.idToken }), [user])

  // TODO should update note as user types (and debounce maybe)

  const handleRevokeToken = async () => {
    try {
      await api.revokeToken(token)
      await update({
        ...secret,
        tokens: secret.tokens.filter(data => data.token !== token),
      })
      navigation.goBack()
      Toast.show('Token successfully revoked')
    } catch (err) {
      Toast.show(`There was an error revoking token: ${token}`)
      console.log(err)
    }
  }

  const handleRefreshToken = async () => {
    try {
      const refreshedToken = await api.generateToken(
        secret,
        subscriptionId,
        token
      )
      const newToken = {
        token: refreshedToken,
        note,
      }
      const tokens = secret.tokens ? [...secret.tokens] : []
      const existingItemIndex = tokens.findIndex(item => item.token === token)

      if (existingItemIndex === -1) {
        tokens.push(newToken)
      } else {
        tokens[existingItemIndex] = newToken
      }

      const secretUpdated = {
        ...secret,
        tokens,
      }

      await update(secretUpdated)

      // Navigate to the new token screen
      navigation.replace('Token', {
        secret: secretUpdated,
        token: refreshedToken,
      })
      Toast.show('Token successfully refreshed')
    } catch (err) {
      Toast.show(`There was an error refreshing token: ${token}`)
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
      <View style={styles.token}>
        <Typography variant="overline">TOKEN</Typography>
        <CopyableInfo textStyle={styles.tokenText}>{token || '-'}</CopyableInfo>
      </View>
      <View style={styles.description}>
        <TextInput
          label="Description"
          value={note}
          onChangeText={setNote}
          mode="outlined"
          multiline
        />
      </View>
      <View style={styles.refresh}>
        <Button
          style={styles.refreshButton}
          icon="refresh"
          mode="contained"
          onPress={handleRefreshToken}
        >
          Refresh Token
        </Button>
        <Typography variant="body2">
          If you renew the token, you’ll need to update it where you’re using it
          to request OTP from command-line.
        </Typography>
      </View>
      <View>
        <Button
          icon="delete-forever"
          mode="outlined"
          onPress={handleRevokeToken}
        >
          Revoke Token
        </Button>
      </View>
    </View>
  )
}
