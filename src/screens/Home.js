import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import { StyleSheet, ScrollView, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { useSecrets } from '../context/secrets'
import { useAuthentication } from '../context/authentication'
import apiFactory from '../lib/api'
import routes from '../lib/routeDefinitions'
import EmptyTokensText from '../components/EmptyTokensText'
import Actions from '../components/Actions'
import Secret from '../components/Secret'
import usePushToken from '../hooks/use-push-token'

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
})

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

export default function Home() {
  const { user } = useAuthentication()
  const { navigate } = useNavigation()
  const { secrets, update, remove } = useSecrets()
  const expoToken = usePushToken()
  const responseListener = useRef()

  const api = useMemo(() => apiFactory({ idToken: user.idToken }), [user])

  const handleGenerateToken = async secret => {
    try {
      const token = await api.generateToken(secret)
      await update({ ...secret, token })
    } catch (err) {
      console.log(err)
    }
  }

  const handleRevokeToken = async secret => {
    try {
      const token = await api.revokeToken(secret)
      await update({ ...secret, token })
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteSecret = async secret => {
    try {
      await api.revokeToken(secret)
      await remove(secret)
    } catch (err) {
      console.log(err)
    }
  }

  const handlePasswordRequest = useCallback(
    async (secret, uniqueId, approved) => {
      try {
        await api.respond(secret, uniqueId, approved)
      } catch (err) {
        console.log(err)
      }
    },
    [api]
  )

  const showRequestAlert = (issuer, account, onApprove, onReject) => {
    Alert.alert(
      'One Time Password requested',
      `For secret issued by ${issuer} to ${account}`,
      [
        {
          text: 'Reject',
          style: 'cancel',
          onPress: onReject,
        },
        { text: 'Approve', onPress: onApprove },
      ],
      { cancelable: false }
    )
  }

  const onNotification = useCallback(
    async notificationData => {
      const {
        notification: {
          request: {
            content: { data },
          },
        },
      } = notificationData
      const { secretId, uniqueId } = data

      const details = secrets.find(({ _id }) => _id === secretId)
      if (!details) {
        console.error(`Failed to find secret with id ${secretId}`)
        return
      }

      const { secret, issuer, account } = details
      showRequestAlert(
        issuer,
        account,
        () => handlePasswordRequest(secret, uniqueId, true),
        () => handlePasswordRequest(secret, uniqueId, false)
      )
    },
    [secrets, handlePasswordRequest]
  )

  useEffect(() => {
    if (!user || !expoToken) return

    const register = async () => {
      await api.registerSubscription({
        type: 'expo',
        token: expoToken,
      })
    }

    register()
  }, [user, api, expoToken])

  useEffect(() => {
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      onNotification
    )

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [onNotification])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {secrets.length === 0 ? (
        <EmptyTokensText />
      ) : (
        secrets.map(secret => (
          <Secret
            key={secret._id}
            data={secret}
            onGenerate={handleGenerateToken}
            onRevoke={handleRevokeToken}
            onDelete={handleDeleteSecret}
          />
        ))
      )}

      <Actions
        onScan={() => navigate(routes.scan.name)}
        onType={() => navigate(routes.type.name)}
      />
    </ScrollView>
  )
}
