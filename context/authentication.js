import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from 'react'
import * as Google from 'expo-auth-session/providers/google'
import firebase from 'firebase'
import * as WebBrowser from 'expo-web-browser'

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

const AuthenticationContext = createContext()

function useFirebaseAuth() {
  const [user, setUser] = useState()

  const [, response, promptAsync] = Google.useIdTokenAuthRequest({
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

  const firebaseAuth = useMemo(() => {
    return { user, promptAsync }
  }, [user, promptAsync])

  return firebaseAuth
}

export function useAuthenticationContext() {
  return useContext(AuthenticationContext)
}

export function AuthenticationProvider({ children }) {
  const { user, promptAsync } = useFirebaseAuth()
  const handleLogout = useCallback(() => firebase.auth().signOut(), [])
  const authValue = useMemo(() => {
    return {
      user,
      handleLogin: promptAsync,
      handleLogout: handleLogout,
    }
  }, [user, promptAsync, handleLogout])

  return (
    <AuthenticationContext.Provider value={authValue}>
      {children}
    </AuthenticationContext.Provider>
  )
}
