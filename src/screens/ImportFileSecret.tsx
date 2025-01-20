import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, Text, TextInput } from 'react-native-paper'
import Toast from 'react-native-root-toast'
import { StackNavigationProp } from '@react-navigation/stack'

import { MainStackParamList } from '../Main'
import { Typography } from '../components/Typography'
import theme from '../lib/theme'
import { decryptDataToSecrets } from '../lib/importExport'
import { useSecrets } from '../context/SecretsContext'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinnerOverlay } from '../components/LoadingSpinnerOverlay'

type ImportFileSecretProps = {
  navigation: StackNavigationProp<MainStackParamList, 'ImportFileSecret'>
  route: {
    params: {
      fileContent: string
    }
  }
}
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
export const ImportFileSecret: React.FC<ImportFileSecretProps> = ({
  navigation,
  route,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [secret, setSecret] = useState<string>('')
  const [disabled, setDisabled] = useState<boolean>(true)
  const { replace } = useSecrets()
  const fileContent = route.params.fileContent
  const { user } = useAuth()
  useEffect(() => {
    setDisabled(!secret.trim())
  }, [secret])

  const handleDecryptImport = async () => {
    setLoading(true)

    try {
      if (!secret.trim()) {
        throw new Error('Secret cannot be empty')
      }
      const secrets = decryptDataToSecrets(
        fileContent,
        `${secret.trim()}.${user.uid}`
      )
      await replace(secrets)
      navigation.navigate('Home')
      Toast.show('Tokens imported successfully')
    } catch (err) {
      console.log(err)
      Toast.show(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <View style={styles.container}>
        <View>
          <Typography variant="h6">
            Insert the secret to decrypt the secrets
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
            icon="lock-open"
            mode="contained"
            disabled={disabled}
            onPress={handleDecryptImport}
          >
            Decrypt Secrets
          </Button>
          <Text
            style={{
              marginTop: theme.spacing(2),
            }}
          >
            Note: If you don&apos;t remember the secret the information cannot
            be recovered
          </Text>
        </View>
      </View>
      {loading && <LoadingSpinnerOverlay />}
    </>
  )
}
