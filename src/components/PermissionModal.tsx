import React, { useState } from 'react'
import { StyleSheet, View, Modal, Text, Pressable, Alert } from 'react-native'
import { openSettings } from 'expo-linking'

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
})

type Props = {
  modalVisible: boolean
  refetchToken: () => Promise<void>
}

export default function PermissionModal({ modalVisible, refetchToken }: Props) {
  const [visible, setVisible] = useState(modalVisible)
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            Please enable notification permissions
          </Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={async () => {
              openSettings()
              setVisible(false)
            }}
          >
            <Text style={styles.textStyle}>Enable</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}
