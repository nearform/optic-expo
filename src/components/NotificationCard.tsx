import React, { useCallback, useMemo, useState } from 'react'
import TimeAgo from 'react-timeago'
import * as LocalAuthentication from 'expo-local-authentication'
import { Notification } from 'expo-notifications'
import { StyleSheet, View } from 'react-native'
import { Avatar, Button, Card, Text } from 'react-native-paper'

import apiFactory from '../lib/api'
import theme from '../lib/theme'
import { LoadingSpinnerOverlay } from '../components/LoadingSpinnerOverlay'
import { NotificationData } from '../types'
import { useAuth } from '../context/AuthContext'
import { useCanUseLocalAuth } from '../hooks/use-can-use-local-auth'
import { usePendingNotifications } from '../context/PendingNotificationsContext'
import { usePrefs } from '../context/PrefsContext'
import { useSecretSelector } from '../hooks/use-secret-selector'
import { useTokenDataSelector } from '../hooks/use-token-data-selector'

import { Typography } from './Typography'

const OTP_REQUEST_TIMEOUT = 60001 // See https://github.com/nearform/optic/blob/master/server/lib/routes/otp.js#L5

const styles = StyleSheet.create({
  noPendingNotifications: {
    paddingTop: theme.spacing(8),
    paddingHorizontal: theme.spacing(3),
    alignItems: 'center',
    flex: 1,
  },
  container: {
    margin: theme.spacing(2),
  },
  cardRow: {
    flex: 1,
    marginTop: theme.spacing(2),
    paddingHorizontal: theme.spacing(1),
  },
  label: {
    color: theme.colors.textSecondary,
    marginRight: theme.spacing(1),
    fontSize: 10,
  },
  tokenDescriptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    marginHorizontal: theme.spacing(1),
    flex: 1,
  },
})

export const NoPendingNotifications = () => (
  <View style={styles.noPendingNotifications}>
    <Typography variant="h5" gutterBottom={4}>
      No Pending Notifications
    </Typography>
    <Typography>New notifications will appear here.</Typography>
  </View>
)

interface TokenInfoProps {
  token: string
  description: string
}

const TokenInfo: React.FC<TokenInfoProps> = ({ token, description }) => {
  return (
    <>
      <View style={styles.cardRow}>
        <Typography variant="overline">Token</Typography>
        <View style={styles.tokenDescriptionRow}>
          <Typography variant="code">{token}</Typography>
        </View>
      </View>
      <View style={styles.cardRow}>
        <View style={styles.tokenDescriptionRow}>
          <Typography variant="body1">{description}</Typography>
        </View>
      </View>
    </>
  )
}

interface NotificationCardProps {
  notification: Notification
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
}) => {
  const data = notification.request.content.data as NotificationData

  const secret = useSecretSelector(data.secretId)
  const token = useTokenDataSelector(data.secretId, data.token)

  const { user } = useAuth()
  const { prefs } = usePrefs()
  const canUseLocalAuth = useCanUseLocalAuth()

  const api = useMemo(() => apiFactory({ idToken: user.idToken }), [user])
  const { removeNotification } = usePendingNotifications()
  const [isLoading, setIsLoading] = useState(false)

  // This is sensible to clocks' drift and lack of synchronization, but if we
  // take into account the roundtrip time, it's not that bad.
  const expired = new Date().getTime() > notification.date + OTP_REQUEST_TIMEOUT

  const handleReject = useCallback(async () => {
    setIsLoading(true)
    await api.respond(secret.secret, data.uniqueId, false)
    await removeNotification(data.uniqueId)
    setIsLoading(false)
  }, [data.uniqueId, secret.secret, api, removeNotification])

  const approveRequest = useCallback(async () => {
    setIsLoading(true)
    await api.respond(secret.secret, data.uniqueId, true)
    await removeNotification(data.uniqueId)
    setIsLoading(false)
  }, [data.uniqueId, secret.secret, api, removeNotification])

  const handleApprove = useCallback(async () => {
    if (!canUseLocalAuth || !prefs.useBiometricAuth) {
      return approveRequest()
    }

    const { success } = await LocalAuthentication.authenticateAsync()
    if (success) {
      await approveRequest()
    }
  }, [canUseLocalAuth, approveRequest, prefs.useBiometricAuth])

  const handleDismiss = useCallback(
    async () => removeNotification(data.uniqueId),
    [data.uniqueId, removeNotification]
  )

  return (
    <>
      <View style={styles.container}>
        <Card>
          <Card.Title
            title={<Typography variant="h5">{secret.issuer}</Typography>}
            subtitle={secret.account}
            left={props => <Avatar.Icon {...props} icon="key" />}
          />
          <Card.Content>
            <TokenInfo token={token.token} description={token.description} />
            <View style={styles.cardRow}>
              <TimeAgo
                date={new Date(notification.date)}
                minPeriod={5}
                component={Text}
              />
            </View>
            <View style={{ ...styles.cardRow, flexDirection: 'row' }}>
              {expired ? (
                <Button
                  style={styles.button}
                  mode="outlined"
                  onPress={handleDismiss}
                >
                  Dismiss
                </Button>
              ) : (
                <>
                  <Button
                    style={styles.button}
                    mode="outlined"
                    onPress={handleReject}
                  >
                    Reject
                  </Button>
                  <Button
                    style={styles.button}
                    mode="contained"
                    onPress={handleApprove}
                  >
                    Approve
                  </Button>
                </>
              )}
            </View>
          </Card.Content>
        </Card>
      </View>
      {isLoading && <LoadingSpinnerOverlay />}
    </>
  )
}
