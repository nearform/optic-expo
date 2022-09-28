import React, { useCallback, useState } from 'react'
import { Text, View } from 'react-native'
import { Button, TextInput } from 'react-native-paper'

type LoginProps = {
  onLogin: (credentials: { user: string; password: string }) => void
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [logginIn, setLoggingIn] = useState(false)

  const login = useCallback(async () => {
    setLoggingIn(true)
    await onLogin({
      user,
      password,
    })
    setLoggingIn(false)
  }, [onLogin, user, password])

  return (
    <View style={{ width: 300 }}>
      <Text style={{ color: 'red', textAlign: 'center', padding: 10 }}>
        FOR PLAY STORE REVIEW ONLY
      </Text>
      <TextInput
        autoComplete="off"
        autoCapitalize="none"
        label="User"
        accessibilityLabel="User"
        value={user}
        onChangeText={setUser}
        disabled={logginIn}
      />
      <TextInput
        autoComplete="off"
        label="Password"
        accessibilityLabel="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        disabled={logginIn}
      />
      <Button
        mode="outlined"
        style={{ backgroundColor: '#fff' }}
        onPress={login}
        disabled={logginIn}
        loading={logginIn}
      >
        Login
      </Button>
    </View>
  )
}
