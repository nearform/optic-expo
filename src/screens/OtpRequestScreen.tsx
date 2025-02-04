import * as LocalAuthentication from 'expo-local-authentication'
import React, { useCallback, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Avatar } from 'react-native-paper'
import Toast from 'react-native-root-toast'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'

import { LoadingSpinnerOverlay } from '../components/LoadingSpinnerOverlay'
import { PackageInfo } from '../components/PackageInfo'
import { ThemedButton } from '../components/ThemedButton'
import { Typography } from '../components/Typography'
import { useAuth } from '../context/AuthContext'
import { usePendingNotifications } from '../context/PendingNotificationsContext'
import { usePrefs } from '../context/PrefsContext'
import { useCanUseLocalAuth } from '../hooks/use-can-use-local-auth'
import { useSecretSelector } from '../hooks/use-secret-selector'
import { useTokenDataSelector } from '../hooks/use-token-data-selector'
import apiFactory from '../lib/api'
import theme from '../lib/theme'
import { MainStackParamList } from '../Main'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing(3),
    paddingTop: theme.spacing(4),
  },
  provider: {
    flexDirection: 'row',
    marginBottom: theme.spacing(4),
  },
  providerIcon: {
    marginRight: theme.spacing(2),
  },
  token: {
    marginBottom: theme.spacing(4),
  },
  description: {
    marginBottom: theme.spacing(3),
  },
  descriptionLabel: {
    marginBottom: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(2),
  },
})

type Props = NativeStackScreenProps<MainStackParamList, 'OtpRequest'>

export const OtpRequestScreen = ({ route, navigation }: Props) => {
  const { goBack, canGoBack, navigate } = navigation
  const { user } = useAuth()
  const { prefs } = usePrefs()
  const canUseLocalAuth = useCanUseLocalAuth()

  const api = useMemo(() => apiFactory({ idToken: user.idToken }), [user])
  const { token, secretId, uniqueId, packageInfo } = route.params
  const secret = useSecretSelector(secretId)
  const tokenData = useTokenDataSelector(secretId, token)
  const description = tokenData ? tokenData.description : ''

  const { removeNotification } = usePendingNotifications()
  const [isLoading, setIsLoading] = useState(false)

  const handleReject = useCallback(async () => {
    setIsLoading(true)
    await api.respond(secret.secret, uniqueId, false)
    await removeNotification(uniqueId)
    Toast.show('OTP request rejected')
    if (canGoBack()) {
      goBack()
    } else {
      navigate('Home')
    }
    setIsLoading(false)
  }, [
    api,
    canGoBack,
    goBack,
    navigate,
    secret.secret,
    uniqueId,
    removeNotification,
  ])

  const approveRequest = useCallback(async () => {
    setIsLoading(true)
    await api.respond(secret.secret, uniqueId, true)
    await removeNotification(uniqueId)
    Toast.show('OTP request approved')
    if (canGoBack()) {
      goBack()
    } else {
      navigate('Home')
    }
    setIsLoading(false)
  }, [
    api,
    canGoBack,
    goBack,
    navigate,
    secret.secret,
    uniqueId,
    removeNotification,
  ])

  const handleApprove = useCallback(async () => {
    if (!canUseLocalAuth || !prefs.useBiometricAuth) return approveRequest()

    const { success } = await LocalAuthentication.authenticateAsync()
    if (success) await approveRequest()
  }, [approveRequest, canUseLocalAuth, prefs])

  return (
    <>
      <View style={styles.container}>
        <View style={styles.provider}>
          <Avatar.Icon
            style={styles.providerIcon}
            icon="key"
            size={theme.spacing(5)}
            color="white"
          />
          <View>
            <Typography variant="h6">{secret.issuer}</Typography>
            <Typography variant="body2">{secret.account}</Typography>
          </View>
        </View>
        <View style={styles.token}>
          <Typography variant="overline">Token</Typography>
          <Typography variant="code">{token}</Typography>
        </View>
        <View style={styles.description}>
          <Typography style={styles.descriptionLabel} variant="subtitle2">
            Description
          </Typography>
          <Typography variant="body1">{description}</Typography>
        </View>
        {packageInfo && <PackageInfo packageInfo={packageInfo} />}
        <View>
          <ThemedButton
            variant="secondary"
            style={styles.button}
            onPress={handleReject}
          >
            Reject
          </ThemedButton>
          <ThemedButton
            variant="primary"
            style={styles.button}
            onPress={handleApprove}
          >
            Approve
          </ThemedButton>
        </View>
      </View>
      {isLoading && <LoadingSpinnerOverlay />}
    </>
  )
}
