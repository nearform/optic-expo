import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'

import { useAuth } from '../context/AuthContext'
import { Secret } from '../types'
import apiFactory from '../lib/api'
import { useSecrets } from '../context/SecretsContext'
import usePushToken from '../hooks/use-push-token'
import { MainStackParamList } from '../Main'
import theme from '../lib/theme'

const styles = StyleSheet.create({
  screen: {
    width: '100%',
  },
  form: {
    padding: theme.spacing(2),
  },
  inputRow: {
    marginBottom: theme.spacing(2),
  },
  formButton: {
    marginTop: theme.spacing(1),
    height: 50,
    justifyContent: 'center',
  },
})

type Props = NativeStackScreenProps<MainStackParamList, 'Token'>

export const TokenScreen = ({ route }: Props) => {
  const { secret } = route.params
  const { user } = useAuth()
  const [subscriptionId, setSubscriptionId] = useState<string>('')
  const [note, setNote] = useState('')
  const { update } = useSecrets()
  const expoToken = usePushToken()

  const api = useMemo(() => apiFactory({ idToken: user.idToken }), [user])

  const invalidNote = note.length < 3
  const disabled = invalidNote

  const handleGenerateToken = async () => {
    try {
      const token = await api.generateToken(secret, subscriptionId)
      const newToken = {
        token,
        note,
      }
      const existingTokens = secret.tokens ? secret.tokens : []
      console.log(token, 'newToken')

      // await update({
      //   ...secret,
      //   tokens: [newToken, ...existingTokens],
      // })
    } catch (err) {
      console.log(err)
    }
  }

  const handleRevokeToken = async (secret: Secret, token: string) => {
    try {
      await api.revokeToken(secret)
      await update({
        ...secret,
        tokens: secret.tokens.filter(data => data.token !== token),
      })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    console.log(user, 'user')
    console.log(expoToken, 'expoToken')
    if (!user || !expoToken) return

    const register = async () => {
      const id = await api.registerSubscription({
        type: 'expo',
        token: expoToken,
      })
      console.log(id, 'id')
      setSubscriptionId(id)
    }

    register()
  }, [user, api, expoToken])

  return (
    <View style={styles.screen}>
      <View style={styles.form}>
        <View style={styles.inputRow}>
          <TextInput
            textAlign="left"
            label="Note"
            accessibilityLabel="Note"
            placeholder="Note about where token will be used"
            mode="outlined"
            value={note}
            onChangeText={setNote}
            autoFocus
          />
        </View>
        <Button
          style={styles.formButton}
          icon="plus"
          mode="contained"
          onPress={handleGenerateToken}
          disabled={disabled}
        >
          Generate Token
        </Button>
      </View>
    </View>
  )
}
