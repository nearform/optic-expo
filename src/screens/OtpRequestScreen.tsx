import { StyleSheet, View } from 'react-native'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import React, { useCallback, useMemo } from 'react'
import { Avatar, Button } from 'react-native-paper'
import Toast from 'react-native-root-toast'

import theme from '../lib/theme'
import { MainStackParamList } from '../Main'
import { useAuth } from '../context/AuthContext'
import apiFactory from '../lib/api'
import { Typography } from '../components/Typography'
import { useTokenDataSelector } from '../hooks/use-token-data-selector'
import { useSecretSelector } from '../hooks/use-secret-selector'

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
  tokenValue: {
    fontFamily: 'monospace',
    fontSize: 24,
    color: theme.colors.text,
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

  const api = useMemo(() => apiFactory({ idToken: user.idToken }), [user])
  const { token, secretId, uniqueId } = route.params
  const secret = useSecretSelector(secretId)
  const tokenData = useTokenDataSelector(token, secretId)
  const description = tokenData ? tokenData.description : ''

  const handleRejectToken = useCallback(async () => {
    await api.respond(secret.secret, uniqueId, false)
    Toast.show('OTP request rejected')
    if (canGoBack()) {
      goBack()
    } else {
      navigate('Home')
    }
  }, [api, canGoBack, goBack, navigate, secret.secret, uniqueId])

  const handleApproveToken = useCallback(async () => {
    await api.respond(secret.secret, uniqueId, true)
    Toast.show('OTP request approved')
    if (canGoBack()) {
      goBack()
    } else {
      navigate('Home')
    }
  }, [api, canGoBack, goBack, navigate, secret.secret, uniqueId])

  return (
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
        <Typography style={styles.tokenValue}>{token}</Typography>
      </View>
      <View style={styles.description}>
        <Typography style={styles.descriptionLabel} variant="subtitle2">
          Description
        </Typography>
        <Typography variant="body1">{description}</Typography>
      </View>
      <View>
        <Button
          style={styles.button}
          mode="outlined"
          onPress={handleRejectToken}
        >
          Reject
        </Button>
        <Button
          style={styles.button}
          mode="contained"
          onPress={handleApproveToken}
        >
          Approve
        </Button>
      </View>
    </View>
  )
}
