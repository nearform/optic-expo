import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import { StackNavigationProp } from '@react-navigation/stack'

import theme from '../lib/defaultTheme'
import { useAuth } from '../context/AuthContext'
import { useSecrets } from '../context/SecretsContext'
import { MainStackParamList } from '../Main'

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
    padding: theme.spacing(2),
  },
  formTextInput: {
    marginTop: theme.spacing(0.5),
  },
  formButton: {
    marginTop: theme.spacing(3),
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
  const [account, setAccount] = useState(user.name)

  const handleAddSecretButtonPress = async () => {
    await add({ uid: user.uid, secret, account, issuer })
    navigation.navigate('Home')
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
          autoFocus
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
