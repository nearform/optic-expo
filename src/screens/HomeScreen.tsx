import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import { NotificationResponse } from 'expo-notifications'
import { ScrollView, StyleSheet, View } from 'react-native'
import { Subscription } from '@unimodules/react-native-adapter'
import { StackNavigationProp } from '@react-navigation/stack'
import { useIsFocused } from '@react-navigation/core'

import { useSecrets } from '../context/SecretsContext'
import { useAuth } from '../context/AuthContext'
import apiFactory from '../lib/api'
import { NoSecrets } from '../components/NoSecrets'
import { Actions } from '../components/Actions'
import { SecretCard } from '../components/SecretCard'
import { Secret } from '../types'
import { MainStackParamList } from '../Main'

type NotificationData = {
  secretId: string
  uniqueId: string
  token: string
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

type HomeScreenProps = {
  navigation: StackNavigationProp<MainStackParamList, 'Home'>
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth()
  const { secrets, remove } = useSecrets()
  const isFocused = useIsFocused()
  const responseListener = useRef<Subscription>()

  const api = useMemo(() => apiFactory({ idToken: user.idToken }), [user])

  const handleAddToken = (secret: Secret) => {
    navigation.navigate('Token', {
      secret,
    })
  }

  const handleViewTokens = useCallback(
    (secret: Secret) => {
      navigation.navigate('TokensList', {
        secret,
      })
    },
    [navigation]
  )

  const handleDeleteSecret = async (secret: Secret) => {
    try {
      await api.deleteSecret(secret)
      await remove(secret)
    } catch (err) {
      console.log(err)
    }
  }

  const onNotification = useCallback(
    async (res: NotificationResponse) => {
      const data = res.notification.request.content.data as NotificationData
      console.log({ data }, 'notification')

      const { secretId, uniqueId, token } = data

      const secret = secrets.find(({ _id }) => _id === secretId)

      if (!secret) {
        console.error(`Failed to find secret with id ${secretId}`)
        return
      }

      navigation.navigate('OtpRequest', {
        token,
        secret,
        uniqueId,
      })
    },
    [navigation, secrets]
  )

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
