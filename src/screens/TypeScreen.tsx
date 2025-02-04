import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput } from 'react-native-paper'

import { ThemedButton } from '../components/ThemedButton'
import { Typography } from '../components/Typography'
import { useAuth } from '../context/AuthContext'
import { useSecrets } from '../context/SecretsContext'
import theme from '../lib/theme'
import { MainStackParamList } from '../Main'

const RFC4648_REGEX = /^[ABCDEFGHIJKLMNOPQRSTUVWXYZ234567]*$/

const styles = StyleSheet.create({
  screen: {
    width: '100%',
  },
  appBarTitle: {
    color: theme.colors.surface,
  },
  form: {
    padding: theme.spacing(2),
  },
  inputRow: {
    marginBottom: theme.spacing(2),
  },
  formButton: {
    marginTop: theme.spacing(1),
    justifyContent: 'center',
  },
})

type TypeScreenProps = {
  navigation: StackNavigationProp<MainStackParamList, 'Type'>
}

export const TypeScreen: React.FC<TypeScreenProps> = ({ navigation }) => {
  const { user } = useAuth()
  const { add } = useSecrets()
  const [issuer, setIssuer] = useState('')
  const [secret, setSecret] = useState('')
  const [account, setAccount] = useState(user.name || '')

  const handleAddSecretButtonPress = async () => {
    const cleanedSecret = secret.replace(/\s/g, '').toUpperCase()
    await add({ uid: user.uid, secret: cleanedSecret, account, issuer })
    navigation.navigate('Home')
  }

  const invalidSecret = !RFC4648_REGEX.test(
    secret.replace(/\s/g, '').toUpperCase()
  )
  const disabled =
    invalidSecret || !secret.trim() || !account.trim() || !issuer.trim()

  return (
    <View style={styles.screen}>
      <View style={styles.form}>
        <View style={styles.inputRow}>
          <TextInput
            autoComplete="off"
            textAlign="left"
            label="Issuer"
            accessibilityLabel="Issuer"
            mode="outlined"
            value={issuer}
            onChangeText={setIssuer}
            autoFocus
          />
        </View>

        <View style={styles.inputRow}>
          <TextInput
            autoComplete="off"
            textAlign="left"
            label="Secret"
            accessibilityLabel="Secret"
            mode="outlined"
            value={secret}
            onChangeText={setSecret}
            error={invalidSecret}
          />
          {invalidSecret && (
            <Typography variant="caption" color={theme.colors.error}>
              Invalid secret
            </Typography>
          )}
        </View>

        <View style={styles.inputRow}>
          <TextInput
            autoComplete="off"
            textAlign="left"
            style={styles.inputRow}
            label="Account"
            accessibilityLabel="Account"
            mode="outlined"
            value={account}
            onChangeText={setAccount}
          />
        </View>

        <ThemedButton
          accessibilityLabel="Add secret"
          style={styles.formButton}
          icon="plus"
          onPress={handleAddSecretButtonPress}
          disabled={disabled}
        >
          Add secret
        </ThemedButton>
      </View>
    </View>
  )
}
