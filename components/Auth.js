import React, { useState, useEffect } from 'react'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import firebase from 'firebase'
import { Button, Platform, StyleSheet, Text, View } from 'react-native'

const firebaseConfig = {
  apiKey: 'AIzaSyBFiuUulmuQ7Pv1VvxpUQB01AWCEQhIToA',
  authDomain: 'npm-otp-f6bfc.firebaseapp.com',
  databaseURL: 'https://npm-otp-f6bfc.firebaseio.com',
  projectId: 'npm-otp-f6bfc',
  storageBucket: 'npm-otp-f6bfc.appspot.com',
  messagingSenderId: '230076165693',
  appId: '1:230076165693:web:a04f9ad6f64be8ec248454',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

WebBrowser.maybeCompleteAuthSession()

export default function Auth() {
  const [user, setUser] = useState()

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      '230076165693-0mj3vb13158tnru89f1re89m9o94g8e7.apps.googleusercontent.com',
  })

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params

      const credential = firebase.auth.GoogleAuthProvider.credential(id_token)
      firebase.auth().signInWithCredential(credential)
    }
  }, [response])

  useEffect(() => firebase.auth().onAuthStateChanged(setUser), [])

  useEffect(() => {
    if (Platform.OS === 'web') {
      return
    }

    WebBrowser.warmUpAsync()

    return () => {
      WebBrowser.coolDownAsync()
    }
  }, [])

  return (
    <View>
      {user && <Text>Hi, {user.displayName}!</Text>}
      <View style={styles.buttons}>
        {user ? (
          <Button title="Logout" onPress={() => firebase.auth().signOut()} />
        ) : (
          <Button title="Login" onPress={() => promptAsync()} />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttons: {
    marginTop: 8,
  },
})
