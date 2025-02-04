import { useIsFocused } from '@react-navigation/core'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput } from 'react-native-paper'
import Toast from 'react-native-root-toast'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'

import { LoadingSpinnerOverlay } from '../components/LoadingSpinnerOverlay'
import { ThemedButton } from '../components/ThemedButton'
import { Typography } from '../components/Typography'
import { useAuth } from '../context/AuthContext'
import { useSecrets } from '../context/SecretsContext'
import usePushToken from '../hooks/use-push-token'
import { useSecretSelector } from '../hooks/use-secret-selector'
import apiFactory from '../lib/api'
import theme from '../lib/theme'
import { MainStackParamList } from '../Main'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing(3),
    paddingTop: theme.spacing(4),
  },
  description: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
})

type Props = NativeStackScreenProps<MainStackParamList, 'CreateToken'>

export const CreateTokenScreen = ({ route, navigation }: Props) => {
  const { secretId } = route.params
  const secret = useSecretSelector(secretId)
  const { user } = useAuth()
  const [subscriptionId, setSubscriptionId] = useState<string>('')
  const [description, setDescription] = useState('')
  const { update } = useSecrets()
  const expoToken = usePushToken()

  const api = useMemo(() => apiFactory({ idToken: user.idToken }), [user])

  const disabled = description.length < 3

  const isFocused = useIsFocused()
  const ref = useRef(null)

  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (isFocused) {
      if (ref.current) ref.current.focus()
    }
  }, [isFocused])

  const handleGenerateToken = async () => {
    setIsGenerating(true)
    try {
      const token = await api.generateToken(secret, subscriptionId)
      const newToken = {
        token,
        description,
      }
      const existingTokens = secret.tokens ? secret.tokens : []
      const secretUpdated = {
        ...secret,
        tokens: [newToken, ...existingTokens],
      }

      await update(secretUpdated)

      navigation.replace('Token', {
        secretId,
        token,
      })
      Toast.show('Token successfully created')
    } catch (err) {
      Toast.show('An error occurred generating the token')
      console.error(err)
    }
    setIsGenerating(false)
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

  if (!secret) {
    return null
  }

  if (process.env.NODE_ENV !== 'test') {
    console.log(expoToken) // only log if not running tests
  }

  return (
    <>
      <View style={styles.container}>
        <View>
          <Typography variant="h6">
            Insert a description for this token
          </Typography>
        </View>
        <View style={styles.description}>
          <TextInput
            autoComplete="off"
            ref={ref}
            textAlign="left"
            label="Description"
            accessibilityLabel="Description"
            placeholder="Description"
            placeholderTextColor={theme.colors.disabled}
            mode="outlined"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>
        <ThemedButton
          icon="plus"
          onPress={handleGenerateToken}
          disabled={disabled}
        >
          Create token
        </ThemedButton>
      </View>
      {isGenerating && <LoadingSpinnerOverlay />}
    </>
  )
}
