import React, { useState, useEffect } from 'react'
import {
  Alert,
  StyleSheet,
  View,
  Modal,
  Pressable,
  Platform,
} from 'react-native'
import { openSettings } from 'expo-linking'
import { isDevice } from 'expo-device'
import * as Notifications from 'expo-notifications'

import theme from '../lib/theme'

import { Typography } from './Typography'

const styles = StyleSheet.create({
  modalContainer: {
    marginTop: 200,
  },
  modalView: {
    height: '60%',
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
  navText: {
    textAlign: 'right',
    color: theme.colors.primary,
  },
  navContainer: {
    flex: 1,
  },
  modalText: {
    marginBottom: 15,
  },
  pressableContainer: {
    marginLeft: 60,
    marginTop: 20,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    borderColor: theme.colors.primary,
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
  const [deviceUnsupported, setDeviceUnsupported] = useState<boolean>(false)
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
      setDeviceUnsupported(true)
      if (typeof process.env.JEST_WORKER_ID === 'undefined') {
        // only log if not running tests
        console.log(
          'permissions denied, non-device (ie. simulator, web) not supported',
        )
      }
    }
  }
  async function sendPermissionRequest() {
    const { status } = await Notifications.requestPermissionsAsync()
    const requestPermissionStatus = status === 'granted'
    setPermissionGranted(requestPermissionStatus)
    return requestPermissionStatus
  }

  async function handleAcceptPermissions() {
    if (!userRejected && !deviceUnsupported) {
      const granted = await sendPermissionRequest()

      if (granted) {
        setPermissionGranted(granted)
      } else {
        setUserRejected(granted)
      }

      if (!granted) {
        setPermissionGranted(false)
        setUserRejected(true)
      } else {
        setPermissionGranted(true)
      }
    } else if (deviceUnsupported) {
      Alert.alert('Notifications not supported. Please use a physical device.')
      openSettings()
    } else {
      openSettings()
    }
  }

  async function handleCloseModal() {
    const { status: isAllowedNotifications } =
      await Notifications.getPermissionsAsync()

    if (isAllowedNotifications !== 'granted') {
      Alert.alert('Please accept notifications.')
    } else {
      setPermissionGranted(true)
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
      onRequestClose={() => {
        handleCloseModal()
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalView}>
          <Typography variant="h6" style={styles.modalText}>
            Enable Push Notifications?
          </Typography>
          <Typography variant="body1">
            This app requires push notification permissions to function.
          </Typography>
          <View style={styles.pressableContainer}>
            <Pressable
              style={styles.navContainer}
              onPress={() => {
                handleCloseModal()
              }}
            >
              <Typography variant="h6" style={styles.navText}>
                CLOSE
              </Typography>
            </Pressable>

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
      </View>
    </Modal>
  )
}
