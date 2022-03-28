import React from 'react'
import { Notification } from 'expo-notifications'
import { StyleSheet, Text, View } from 'react-native'
import { Avatar, Card } from 'react-native-paper'

import { useSecretSelector } from '../hooks/use-secret-selector'
import { useTokenDataSelector } from '../hooks/use-token-data-selector'
import theme from '../lib/theme'
import { NotificationData } from '../types'

import { Typography } from './Typography'

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
        <Text style={styles.label}>Token</Text>
        <View style={styles.tokenDescriptionRow}>
          <Text>{token}</Text>
        </View>
      </View>
      <View style={styles.cardRow}>
        <Text style={styles.label}>Token description</Text>
        <View style={styles.tokenDescriptionRow}>
          <Text>{description}</Text>
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

  return (
    <View style={styles.container}>
      <Card>
        <Card.Title
          title={<Typography variant="h5">{secret.issuer}</Typography>}
          subtitle={secret.account}
          left={props => <Avatar.Icon {...props} icon="key" />}
        />
        <Card.Content>
          <TokenInfo token={token.token} description={token.description} />
        </Card.Content>
      </Card>
    </View>
  )
}
