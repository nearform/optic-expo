import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from 'react'
import * as Google from 'expo-auth-session/providers/google'
import firebase from 'firebase'
import * as WebBrowser from 'expo-web-browser'
import Constants from 'expo-constants'

import { User } from '../types'

interface FirebaseSettings {
  apiKey: string
  authDomain: string
  databaseURL: string
  projectId: string
  storageBucket
  messagingSenderId: string
  appId: string
  clientId: string
  androidClientId: string
  iosClientId: string
}

const {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  clientId,
  androidClientId,
  iosClientId,
} = Constants.expoConfig?.extra as FirebaseSettings

const firebaseConfig = {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

WebBrowser.maybeCompleteAuthSession()

type ContextType = {
  loading: boolean
  user: User | null
  handleLogin: () => void
  handleLogout: () => Promise<void>
}

const AuthContext = React.createContext<ContextType | undefined>(undefined)

type AuthenticationProviderProps = {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthenticationProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User>()

  const [, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: clientId,
    clientId,
    androidClientId,
    iosClientId,
  })

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params

      const credential = firebase.auth.GoogleAuthProvider.credential(id_token)
      firebase.auth().signInWithCredential(credential)
    }
  }, [response])

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async firebaseUser => {
      setLoading(false)
      if (!firebaseUser) return

      setUser({
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        uid: firebaseUser.uid,
        idToken: await firebaseUser.getIdToken(),
      })
    })
  }, [])

  const handleLogin = useCallback<ContextType['handleLogin']>(
    () => promptAsync(),
    [promptAsync]
  )

  const handleLogout = useCallback<ContextType['handleLogout']>(async () => {
    await firebase.auth().signOut()
    setUser(null)
  }, [])

  const context = useMemo<ContextType>(
    () => ({
      loading,
      user,
      handleLogout,
      handleLogin,
    }),
    [user, loading, handleLogout, handleLogin]
  )

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) throw new Error('AuthContext must be used within AuthProvider')

  return context
}
