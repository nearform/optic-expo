import React, { useEffect, useMemo, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Button, ProgressBar, TextInput } from 'react-native-paper'
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
import { useSecretSelector } from '../hooks/use-secret-selector'
import { useTokenDataSelector } from '../hooks/use-token-data-selector'
import { LoadingSpinnerOverlay } from '../components/LoadingSpinnerOverlay'

const SAVE_UPDATED_DESCRIPTION_DELAY = 1000

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing(3),
    paddingTop: theme.spacing(4),
  },
  token: {
    marginBottom: theme.spacing(4),
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
  refreshingLoader: {
    position: 'absolute',
    flex: 1,
    width: '100%',
  },
})

const showRevokeConfirmAlert = (onConfirm: () => void) => {
  Alert.alert(
    'Revoke Token',
    'This will permanently remove the token. Are you sure you want to continue?',
    [
      {
        text: 'CANCEL',
        style: 'cancel',
      },
      { text: 'REVOKE', onPress: onConfirm },
    ],
    { cancelable: true }
  )
}

const showRefreshConfirmAlert = (onConfirm: () => void) => {
  Alert.alert(
    'Refresh Token',
    'This will generate a new token. Are you sure you want to continue?',
    [
      {
        text: 'CANCEL',
        style: 'cancel',
      },
      { text: 'REFRESH', onPress: onConfirm },
    ],
    { cancelable: true }
  )
}

type Props = NativeStackScreenProps<MainStackParamList, 'Token'>

export const TokenScreen = ({ route, navigation }: Props) => {
  const { secretId, token } = route.params
  const secret = useSecretSelector(secretId)
  const tokens = secret?.tokens ? secret.tokens : []
  const tokenData = useTokenDataSelector(secretId, token)
  const { user } = useAuth()
  const [subscriptionId, setSubscriptionId] = useState<string>('')
  const [description, setDescription] = useState(tokenData?.description || '')
  const { update } = useSecrets()
  const expoToken = usePushToken()
  const [isRevoking, setIsRevoking] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const api = useMemo(() => apiFactory({ idToken: user.idToken }), [user])

  const handleRevokeToken = async () => {
    if (!subscriptionId) {
      Toast.show(`Server connection required to revoke token`)
      return
    }
    setIsRevoking(true)
    try {
      await api.revokeToken(token)
      await update({
        ...secret,
        tokens: tokens.filter(data => data.token !== token),
      })
      navigation.goBack()
      Toast.show('Token successfully revoked')
    } catch (err) {
      Toast.show(`There was an error revoking token: ${token}`)
      console.log(err)
    }
    setIsRevoking(false)
  }

  const handleRefreshToken = async () => {
    if (!subscriptionId) {
      Toast.show(`Server connection required to refresh token`)
      return
    }

    setIsRefreshing(true)

    try {
      const refreshedToken = await api.generateToken(
        secret,
        subscriptionId,
        token
      )
      const newToken = {
        token: refreshedToken,
        description,
      }
      const tokensCopy = [...tokens]
      const existingItemIndex = tokens.findIndex(item => item.token === token)

      if (existingItemIndex === -1) {
        tokensCopy.push(newToken)
      } else {
        tokensCopy[existingItemIndex] = newToken
      }

      const secretUpdated = {
        ...secret,
        tokens: tokensCopy,
      }

      await update(secretUpdated)

      // Navigate to the new token screen
      navigation.replace('Token', {
        secretId: secretId,
        token: refreshedToken,
      })
      Toast.show('Token successfully refreshed')
    } catch (err) {
      Toast.show(`There was an error refreshing token: ${token}`)
      console.log(err)
    }

    setIsRefreshing(false)
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

  // Keep the description for the token up to date
  useEffect(() => {
    const updateDescription = async () => {
      const existingTokens = secret.tokens ? [...secret.tokens] : []
      const existingItemIndex = existingTokens.findIndex(
        item => item.token === token
      )
      if (existingItemIndex === -1) {
        return
      }
      const { description: existingDescription } =
        existingTokens[existingItemIndex]
      if (description === existingDescription || description.length < 3) {
        return
      }
      existingTokens[existingItemIndex] = { token, description }
      await update({
        ...secret,
        tokens: existingTokens,
      })
      Toast.show('Token description updated')
    }
    const timeoutId = setTimeout(
      updateDescription,
      SAVE_UPDATED_DESCRIPTION_DELAY
    )
    return () => {
      clearTimeout(timeoutId)
    }
  }, [description, secret, token, update])

  return (
    <>
      <View style={styles.container}>
        <View style={styles.token}>
          <Typography variant="overline">TOKEN</Typography>
          <CopyableInfo typographyVariant="code">{token || '-'}</CopyableInfo>
        </View>
        <View style={styles.description}>
          <TextInput
            autoComplete="off"
            label="Description"
            accessibilityLabel="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
          />
        </View>
        <View style={styles.refresh}>
          <Button
            style={styles.refreshButton}
            icon="refresh"
            mode="contained"
            onPress={() => showRefreshConfirmAlert(handleRefreshToken)}
          >
            REFRESH TOKEN
          </Button>
          <Typography variant="body2">
            If you renew the token, you’ll need to update it where you’re using
            it to request OTP from command-line.
          </Typography>
        </View>
        <View>
          <Button
            icon="delete-forever"
            mode="outlined"
            onPress={() => showRevokeConfirmAlert(handleRevokeToken)}
          >
            REVOKE TOKEN
          </Button>
        </View>
      </View>
      {isRefreshing && (
        <View style={styles.refreshingLoader}>
          <ProgressBar indeterminate />
        </View>
      )}
      {(isRevoking || !subscriptionId) && <LoadingSpinnerOverlay />}
    </>
  )
}
