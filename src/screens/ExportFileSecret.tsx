import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import CryptoJS from 'react-native-crypto-js'
import Toast from 'react-native-root-toast'
import { StackNavigationProp } from '@react-navigation/stack'

import { Typography } from '../components/Typography'
import { useSecrets } from '../context/SecretsContext'
import theme from '../lib/theme'
import { useAuth } from '../context/AuthContext'
import { doExport } from '../lib/importExport'
import { MainStackParamList } from '../Main'

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

type ExportFileSecretProps = {
  navigation: StackNavigationProp<MainStackParamList, 'ExportFileSecret'>
}

export const ExportFileSecret: React.FC<ExportFileSecretProps> = ({
  navigation,
}) => {
  const [secret, setSecret] = useState<string>('')
  const [disabled, setDisabled] = useState<boolean>(true)
  const { user } = useAuth()
  const { secrets } = useSecrets()
  const navigate = navigation.navigate
  useEffect(() => {
    setDisabled(!secret.trim())
  }, [secret])

  const handleExport = async () => {
    try {
      if (!secrets.length) {
        throw new Error('There is no secret to be exported.')
      }
      if (!secret.trim()) {
        throw new Error('Secret cannot be empty')
      }
      const encriptionSecret = `${secret}.${user.uid}`
      const fileContent = CryptoJS.AES.encrypt(
        JSON.stringify(secrets),
        encriptionSecret
      ).toString()
      const fileName = `optic-backup-${new Date()
        .toISOString()
        .replace(/[^0-9]/g, '')
        .slice(0, -3)}.txt`

      await doExport(fileName, fileContent)
      Toast.show('Tokens exported successfully')
      navigate('Home')
    } catch (err) {
      Toast.show(err.message)
      console.log(err)
    }
  }

  return (
    <View style={styles.container}>
      <View>
        <Typography variant="h6">
          Insert a secret to encrypt the exported file
        </Typography>
      </View>
      <View style={styles.description}>
        <TextInput
          autoComplete="off"
          textAlign="left"
          label="Secret"
          value={secret}
          onChangeText={setSecret}
          accessibilityLabel="Secret"
          placeholder="Encryption Secret"
          mode="outlined"
        />
        <Button
          style={styles.button}
          icon="lock"
          mode="contained"
          disabled={disabled}
          onPress={handleExport}
        >
          Encrypt File Information before save
        </Button>
        <Text
          style={{
            marginTop: theme.spacing(2),
          }}
        >
          Note: If you don&apos;t remember the secret when importing the files
          the information cannot be recovered
        </Text>
      </View>
    </View>
  )
}
