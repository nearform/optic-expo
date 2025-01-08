import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import { NotificationResponse } from 'expo-notifications'
import { ScrollView, StyleSheet, View } from 'react-native'
import { EventSubscription } from 'expo-modules-core'
import { StackNavigationProp } from '@react-navigation/stack'
import { useIsFocused } from '@react-navigation/core'
import Toast from 'react-native-root-toast'

import { usePendingNotifications } from '../context/PendingNotificationsContext'
import { useSecrets } from '../context/SecretsContext'
import { useAuth } from '../context/AuthContext'
import { useInitialLoading } from '../context/InitalLoadingContext'
import apiFactory from '../lib/api'
import { NoSecrets } from '../components/NoSecrets'
import { Actions } from '../components/Actions'
import { SecretCard } from '../components/SecretCard'
import { NotificationData, OpticNotification, Secret } from '../types'
import { MainStackParamList } from '../Main'
import NotificationPermissionRequest from '../components/NotificationPermissionRequest'
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
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

type HomeScreenProps = {
  navigation: StackNavigationProp<MainStackParamList, 'Home'>
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth()
  const { secrets, secretsLoading, remove } = useSecrets()
  const { addNotification } = usePendingNotifications()
  const isFocused = useIsFocused()
  const notificationListener = useRef<EventSubscription>()
  const responseListener = useRef<EventSubscription>()
  const lastNotificationResponse = Notifications.useLastNotificationResponse()
  const { initialLoadingComplete, markInitialLoadingComplete } =
    useInitialLoading()

  const api = useMemo(() => apiFactory({ idToken: user.idToken }), [user])

  const handleAddToken = (secret: Secret) => {
    navigation.navigate('CreateToken', {
      secretId: secret._id,
    })
  }

  const handleViewTokens = useCallback(
    (secret: Secret) => {
      navigation.navigate('TokensList', {
        secretId: secret._id,
        // Included here to make it easier to show in react navigation title
        issuer: secret.issuer,
      })
    },
    [navigation],
  )

  const handleDeleteSecret = async (secret: Secret) => {
    try {
      await api.deleteSecret(secret)
      await remove(secret)
      Toast.show('Secret successfully deleted')
      return true
    } catch (err) {
      console.log(err)
      Toast.show(`An error occured while deleting the secret`)
      return false
    }
  }

  const onNotification = useCallback(
    async (notification: OpticNotification) => {
      addNotification(notification)
    },
    [addNotification],
  )

  const onNotificationResponse = useCallback(
    async (res: NotificationResponse) => {
      const data = res.notification.request.content.data as NotificationData

      const { secretId, uniqueId, token, packageInfo } = data

      const secret = secrets.find(({ _id }) => _id === secretId)

      if (!secret) {
        console.error(`Failed to find secret with id ${secretId}`)
        return
      }

      navigation.navigate('OtpRequest', {
        token,
        secretId,
        uniqueId,
        packageInfo,
      })
    },
    [navigation, secrets],
  )

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener(onNotification)

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        onNotificationResponse,
      )

    return () => {
      Notifications.removeNotificationSubscription(responseListener.current)
      Notifications.removeNotificationSubscription(notificationListener.current)
    }
  }, [onNotification, onNotificationResponse])

  useEffect(() => {
    // runs callbacks when notification is pressed from a cold start
    if (
      !initialLoadingComplete &&
      !secretsLoading &&
      lastNotificationResponse
    ) {
      const request = lastNotificationResponse.notification
        .request as Notifications.NotificationRequest & {
        content: { data: NotificationData }
      }
      const opticNotification: OpticNotification = {
        date: lastNotificationResponse.notification.date,
        request: request,
      }

      onNotificationResponse(lastNotificationResponse)
      onNotification(opticNotification)

      // prevents the cold start callbacks from being called again after this conditional has been triggered
      markInitialLoadingComplete()
    }
  }, [
    initialLoadingComplete,
    lastNotificationResponse,
    markInitialLoadingComplete,
    onNotification,
    onNotificationResponse,
    secretsLoading,
  ])

  if (secretsLoading) {
    return null
  }

  return (
    <View style={styles.container}>
      <NotificationPermissionRequest />
      <ScrollView contentContainerStyle={styles.scrollView}>
        {secrets.length === 0 ? (
          <NoSecrets />
        ) : (
          secrets.map(secret => (
            <SecretCard
              key={secret._id}
              data={secret}
              onAddToken={() => handleAddToken(secret)}
              onDelete={handleDeleteSecret}
              onViewTokens={() => handleViewTokens(secret)}
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
