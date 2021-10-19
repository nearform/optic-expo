import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import { StyleSheet, ScrollView, Alert } from 'react-native'
import { Subscription } from '@unimodules/react-native-adapter'
import { StackNavigationProp } from '@react-navigation/stack'

import { useSecrets } from '../context/secrets'
import { useAuthentication } from '../context/authentication'
import apiFactory from '../lib/api'
import EmptyTokensText from '../components/EmptyTokensText'
import Actions from '../components/Actions'
import { SecretCard } from '../components/SecretCard'
import usePushToken from '../hooks/use-push-token'
import { Secret } from '../types'
import { MainStackParamList } from '../Main'

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

type HomeScreenProps = {
  navigation: StackNavigationProp<MainStackParamList, 'Home'>
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuthentication()
  const { secrets, update, remove } = useSecrets()
  const expoToken = usePushToken()
  const responseListener = useRef<Subscription>()

  const api = useMemo(() => apiFactory({ idToken: user.idToken }), [user])

  const handleGenerateToken = async (secret: Secret) => {
    try {
      const token = await api.generateToken(secret)
      await update({ ...secret, token })
    } catch (err) {
      console.log(err)
    }
  }

  const handleRevokeToken = async (secret: Secret) => {
    try {
      await api.revokeToken(secret)
      await update({ ...secret, token: null })
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteSecret = async (secret: Secret) => {
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

  const showRequestAlert = (
    issuer: string,
    account: string,
    onApprove,
    onReject
  ) => {
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
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(onNotification)

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
          <SecretCard
            key={secret._id}
            data={secret}
            onGenerate={handleGenerateToken}
            onRevoke={handleRevokeToken}
            onDelete={handleDeleteSecret}
          />
        ))
      )}

      <Actions
        onScan={() => navigation.navigate('Scan')}
        onType={() => navigation.navigate('Type')}
      />
    </ScrollView>
  )
}
