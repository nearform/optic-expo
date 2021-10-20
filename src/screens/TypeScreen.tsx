import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput, Button } from 'react-native-paper'
import { StackNavigationProp } from '@react-navigation/stack'

import theme from '../lib/theme'
import { useAuth } from '../context/AuthContext'
import { useSecrets } from '../context/SecretsContext'
import { MainStackParamList } from '../Main'

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
    marginBottom: theme.spacing(2),
  },
  formButton: {
    marginTop: theme.spacing(1),
    height: 50,
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
  const [account, setAccount] = useState(user.name)

  const handleAddSecretButtonPress = async () => {
    await add({ uid: user.uid, secret, account, issuer })
    navigation.navigate('Home')
  }

  return (
    <View style={styles.screen}>
      <View style={styles.form}>
        <TextInput
          textAlign="left"
          style={styles.formTextInput}
          label="Issuer"
          mode="outlined"
          value={issuer}
          onChangeText={setIssuer}
          autoFocus
        />
        <TextInput
          textAlign="left"
          style={styles.formTextInput}
          label="Secret"
          mode="outlined"
          value={secret}
          onChangeText={setSecret}
        />
        <TextInput
          textAlign="left"
          style={styles.formTextInput}
          label="Account"
          mode="outlined"
          value={account}
          onChangeText={setAccount}
        />
        <Button
          style={styles.formButton}
          icon="plus"
          mode="contained"
          onPress={handleAddSecretButtonPress}
          disabled={!(secret && account && issuer)}
        >
          Add Secret
        </Button>
      </View>
    </View>
  )
}
