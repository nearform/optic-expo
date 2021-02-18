import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

import theme from '../lib/defaultTheme'
import routes from '../lib/routeDefinitions'
import { useAuthenticationContext } from '../context/authentication'
import { useSecretsContext } from '../context/secrets'

export default function TypeNewSecret() {
  const { user } = useAuthenticationContext()
  const { add } = useSecretsContext()
  const [issuer, setIssuer] = useState('')
  const [secret, setSecret] = useState('')
  const [account, setAccount] = useState(user.displayName)
  const { navigate } = useNavigation()

  const handleAddSecretButtonPress = async () => {
    await add({ uid: user.uid, secret, account, issuer })
    navigate(routes.home.name)
  }

  return (
    <View style={styles.screen}>
      <View style={styles.form}>
        <TextInput
          style={styles.formTextInput}
          label={UI_STRINGS.issuerTextInputLabel}
          mode="outlined"
          value={issuer}
          onChangeText={setIssuer}
        />
        <TextInput
          style={styles.formTextInput}
          label={UI_STRINGS.secretTextInputLabel}
          mode="outlined"
          value={secret}
          onChangeText={setSecret}
        />
        <TextInput
          style={styles.formTextInput}
          label={UI_STRINGS.accountTextInput}
          mode="outlined"
          value={account}
          onChangeText={setAccount}
        />
        <Button
          style={styles.formButton}
          icon="plus"
          mode="contained"
          onPress={handleAddSecretButtonPress}
        >
          {UI_STRINGS.addSecretButtonLabel}
        </Button>
      </View>
    </View>
  )
}

const UI_STRINGS = {
  issuerTextInputLabel: 'Issuer',
  secretTextInputLabel: 'Secret',
  accountTextInput: 'Account',
  addSecretButtonLabel: 'Add Secret',
}

const styles = StyleSheet.create({
  screen: {
    width: '100%',
  },
  appBarTitle: {
    color: theme.colors.surface,
  },
  form: {
    padding: theme.spacing(0.5),
  },
  formTextInput: {
    marginTop: theme.spacing(0.5),
  },
  formButton: {
    marginTop: theme.spacing(1.5),
  },
})
