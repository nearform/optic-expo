import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Modal, Pressable, Platform } from 'react-native'
import { openSettings } from 'expo-linking'
import { isDevice } from 'expo-device'
import * as Notifications from 'expo-notifications'

import theme from '../lib/theme'

import { Typography } from './Typography'

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 200,
  },
  modalView: {
    margin: 15,
    borderRadius: 3,
    backgroundColor: 'white',
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  navText: {
    textAlign: 'right',
    color: theme.colors.primary,
  },
  navContainer: {
    marginTop: 30,
  },
  modalText: {
    marginBottom: 15,
  },
})

async function setChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }
}

export default function NotificationPermissionRequest() {
  const [permissionGranted, setPermissionGranted] = useState<boolean>(true)
  const [userRejected, setUserRejected] = useState<boolean>(false)
  async function checkPermissions() {
    if (isDevice) {
      await setChannel()
      const { status: isAllowedNotifications } =
        await Notifications.getPermissionsAsync()
      if (isAllowedNotifications !== 'granted') {
        setPermissionGranted(false)
      } else {
        setPermissionGranted(true)
      }
    } else {
      setPermissionGranted(false)
      console.log('permissions denied')
    }
  }
  async function sendPermissionRequest() {
    const { status } = await Notifications.requestPermissionsAsync()
    const requestPermissionStatus = status === 'granted'
    setPermissionGranted(requestPermissionStatus)
    return requestPermissionStatus
  }

  async function handleAcceptPermissions() {
    if (!userRejected) {
      const granted = await sendPermissionRequest()

      granted ? setPermissionGranted(granted) : setUserRejected(granted)
      if (!granted) {
        setPermissionGranted(false)
        setUserRejected(true)
      } else {
        setPermissionGranted(true)
      }
    } else {
      openSettings()
    }
  }

  useEffect(() => {
    const fn = async () => {
      await checkPermissions()
    }
    fn()
  }, [permissionGranted])

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={!permissionGranted}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Typography variant="h6" style={styles.modalText}>
            Enable Push Notifications?
          </Typography>
          <Typography variant="body1">
            This app requires push notification permissions to function.
          </Typography>

          <Pressable
            style={styles.navContainer}
            onPress={() => {
              handleAcceptPermissions()
            }}
          >
            <Typography variant="h6" style={styles.navText}>
              ENABLE
            </Typography>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}
