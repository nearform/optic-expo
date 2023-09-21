import React, { useState } from 'react'
import { StyleSheet, View, Modal, Pressable } from 'react-native'
import { openSettings } from 'expo-linking'

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

type Props = {
  modalVisible: boolean
}

export default function PermissionModal({ modalVisible }: Props) {
  const [visible, setVisible] = useState(modalVisible)
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(false)
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
          <Pressable
            style={styles.navContainer}
            onPress={async () => {
              openSettings()
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
