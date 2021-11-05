import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as Notifications from 'expo-notifications'
import { StyleSheet, ScrollView, Alert, View } from 'react-native'
import { Subscription } from '@unimodules/react-native-adapter'
import { StackNavigationProp } from '@react-navigation/stack'
import { NotificationResponse } from 'expo-notifications'
import { useIsFocused } from '@react-navigation/core'

import { useSecrets } from '../context/SecretsContext'
import { useAuth } from '../context/AuthContext'
import apiFactory from '../lib/api'
import { NoSecrets } from '../components/NoSecrets'
import { Actions } from '../components/Actions'
import { SecretCard } from '../components/SecretCard'
import usePushToken from '../hooks/use-push-token'
import { Secret } from '../types'
import { MainStackParamList } from '../Main'

type NotificationData = {
  secretId: string
  uniqueId: string
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
  scrollView: {
    flexGrow: 1,
  },
})

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

const showRequestAlert = (
  issuer: string,
  account: string,
  onApprove: () => void,
  onReject: () => void
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

type HomeScreenProps = {
  navigation: StackNavigationProp<MainStackParamList, 'Home'>
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth()
  const { secrets, update, remove, updateUserId } = useSecrets()
  const expoToken = usePushToken()
  const isFocused = useIsFocused()
  const responseListener = useRef<Subscription>()
  const [subscriptionId, setSubscriptionId] = useState<string>('')

  const api = useMemo(() => apiFactory({ idToken: user.idToken }), [user])

  const handleGenerateToken = async (secret: Secret) => {
    try {
      const token = await api.generateToken(secret, subscriptionId)
      await update({ ...secret, token })
    } catch (err) {
      console.log(err)
    }
  }

  const handleRevokeToken = async (secret: Secret) => {
    try {
      await api.revokeToken(secret)
      await update({ ...secret, token: undefined })
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
    async (secret: string, uniqueId: string, approved: boolean) => {
      try {
        await api.respond(secret, uniqueId, approved)
      } catch (err) {
        console.log(err)
      }
    },
    [api]
  )

  const onNotification = useCallback(
    async (res: NotificationResponse) => {
      const data = res.notification.request.content.data as NotificationData

      const { secretId, uniqueId } = data

      const details = secrets.find(({ _id }) => _id === secretId)

      if (!details) {
        console.error(`Failed to find secret with id ${secretId}`)
        return
      }

      const { secret, issuer, account } = details

      // Delay ensures the prompt is shown, else it's missed some time
      setTimeout(() => {
        showRequestAlert(
          issuer,
          account,
          () => handlePasswordRequest(secret, uniqueId, true),
          () => handlePasswordRequest(secret, uniqueId, false)
        )
      }, 100)
    },
    [secrets, handlePasswordRequest]
  )

  useEffect(() => {
    if (!user || !expoToken) return

    updateUserId(user.uid)

    const register = async () => {
      const id = await api.registerSubscription({
        type: 'expo',
        token: expoToken,
      })
      setSubscriptionId(id)
    }

    register()
  }, [user, api, expoToken, updateUserId])

  useEffect(() => {
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(onNotification)

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [onNotification])

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {secrets.length === 0 ? (
          <NoSecrets />
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
      </ScrollView>
      <Actions
        onScan={() => navigation.navigate('Scan')}
        onType={() => navigation.navigate('Type')}
        visible={isFocused}
      />
    </View>
  )
}
