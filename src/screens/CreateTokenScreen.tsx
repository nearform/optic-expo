import React, { useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, View, Modal, Text, Pressable, Alert } from 'react-native'
import * as Linking from 'expo-linking'
import { Button, TextInput } from 'react-native-paper'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import Toast from 'react-native-root-toast'
import { useIsFocused } from '@react-navigation/core'

import { useAuth } from '../context/AuthContext'
import apiFactory from '../lib/api'
import { useSecrets } from '../context/SecretsContext'
import usePushToken from '../hooks/use-push-token'
import { MainStackParamList } from '../Main'
import theme from '../lib/theme'
import { Typography } from '../components/Typography'
import { useSecretSelector } from '../hooks/use-secret-selector'
import { LoadingSpinnerOverlay } from '../components/LoadingSpinnerOverlay'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing(3),
    paddingTop: theme.spacing(4),
  },
  description: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
  button: {
    marginTop: theme.spacing(1),
    justifyContent: 'center',
  },
})

const test = StyleSheet.create({
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

type Props = NativeStackScreenProps<MainStackParamList, 'CreateToken'>

export const CreateTokenScreen = ({ route, navigation }: Props) => {
  const { secretId } = route.params
  const secret = useSecretSelector(secretId)
  const { user } = useAuth()
  const [subscriptionId, setSubscriptionId] = useState<string>('')
  const [description, setDescription] = useState('')
  const { update } = useSecrets()
  const expoToken = usePushToken()
  const [modalVisible, setModalVisible] = useState(expoToken ? false : true)
  const api = useMemo(() => apiFactory({ idToken: user.idToken }), [user])

  const disabled = description.length < 3

  const isFocused = useIsFocused()
  const ref = useRef(null)

  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (isFocused) {
      ref.current && ref.current.focus()
    }
  }, [isFocused])

  const handleGenerateToken = async () => {
    setIsGenerating(true)
    try {
      const token = await api.generateToken(secret, subscriptionId)
      const newToken = {
        token,
        description,
      }
      const existingTokens = secret.tokens ? secret.tokens : []
      const secretUpdated = {
        ...secret,
        tokens: [newToken, ...existingTokens],
      }

      await update(secretUpdated)

      navigation.replace('Token', {
        secretId,
        token,
      })
      Toast.show('Token successfully created')
    } catch (err) {
      Toast.show('An error occurred generating the token')
      console.error(err)
    }
    setIsGenerating(false)
  }

  useEffect(() => {
    if (!user || !expoToken) return

    const register = async () => {
      const id = await api.registerSubscription({
        type: 'expo',
        token: expoToken,
      })
      setSubscriptionId(id)
    }

    register()
  }, [user, api, expoToken])

  if (!secret) {
    return null
  }

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.')
          setModalVisible(!modalVisible)
        }}
      >
        <View style={test.centeredView}>
          <View style={test.modalView}>
            <Text style={test.modalText}>
              Please enable notification permissions
            </Text>
            <Pressable
              style={[test.button, test.buttonClose]}
              onPress={Linking.openSettings}
            >
              <Text style={test.textStyle}>Enable</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <View>
          <Typography variant="h6">
            Insert a description for this token
          </Typography>
        </View>
        <View style={styles.description}>
          <TextInput
            autoComplete="off"
            ref={ref}
            textAlign="left"
            label="Description"
            accessibilityLabel="Description"
            placeholder="Description"
            placeholderTextColor={theme.colors.disabled}
            mode="outlined"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>
        <Button
          style={styles.button}
          icon="plus"
          mode="contained"
          onPress={handleGenerateToken}
          disabled={disabled}
        >
          Create Token
        </Button>
      </View>
      {isGenerating && <LoadingSpinnerOverlay />}
    </>
  )
}
