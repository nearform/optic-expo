import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Google from 'expo-auth-session/providers/google'
import { FirebaseApp, initializeApp, getApp, getApps } from 'firebase/app'
import {
  Auth,
  User as FirebaseUser,
  OAuthProvider,
  GoogleAuthProvider,
  initializeAuth,
  getAuth,
  signInWithEmailAndPassword,
  signInWithCredential,
  onAuthStateChanged,
} from 'firebase/auth'
import { getReactNativePersistence } from 'firebase/auth/react-native'
import * as WebBrowser from 'expo-web-browser'
import Constants from 'expo-constants'
import * as AppleAuthentication from 'expo-apple-authentication'

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

let firebaseApp: FirebaseApp
let firebaseAuth: Auth
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig)
  firebaseAuth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  })
} else {
  firebaseApp = getApp()
  firebaseAuth = getAuth()
}

WebBrowser.maybeCompleteAuthSession()

type ContextType = {
  loading: boolean
  user: User | null
  handleLoginGoogle: () => void
  handleLoginApple: () => void
  handleLoginPassword: (credentials: { user: string; password: string }) => void
  handleLogout: () => Promise<void>
  handleDeleteAccount: () => Promise<void>
}

const AuthContext = React.createContext<ContextType | undefined>(undefined)

type AuthenticationProviderProps = {
  children: React.ReactNode
}

const projectNameForProxy = `@${Constants.expoConfig.owner}/${Constants.expoConfig.slug}`

function useGoogleAuth() {
  const [, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      expoClientId: clientId,
      clientId,
      androidClientId,
      iosClientId,
    },
    {
      projectNameForProxy,
    }
  )

  const login = useCallback<ContextType['handleLoginGoogle']>(
    () =>
      promptAsync({
        projectNameForProxy,
      }),
    [promptAsync]
  )

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params
      const credentials = GoogleAuthProvider.credential(id_token)
      signInWithCredential(firebaseAuth, credentials)
    }
  }, [response])

  return login
}

function useAppleAuth() {
  const login = useCallback<ContextType['handleLoginApple']>(async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL],
      })
      const provider = new OAuthProvider('apple.com')
      const credentials = provider.credential({
        idToken: credential.identityToken,
      })
      signInWithCredential(firebaseAuth, credentials)
    } catch (e) {
      // do nothing
    }
  }, [])

  return login
}

function usePasswordAuth() {
  return useCallback(async ({ user, password }) => {
    await signInWithEmailAndPassword(firebaseAuth, user, password)
  }, [])
}

export const AuthProvider: React.FC<AuthenticationProviderProps> = ({
  children,
}) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser>()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User>()

  const handleLoginGoogle = useGoogleAuth()
  const handleLoginApple = useAppleAuth()
  const handleLoginPassword = usePasswordAuth()

  useEffect(() => {
    onAuthStateChanged(firebaseAuth, newFirebaseUser => {
      setLoading(false)
      setFirebaseUser(newFirebaseUser)
    })
  }, [])

  useEffect(() => {
    const updateUser = async () => {
      if (!firebaseUser) {
        setUser(null)
        return
      }
      const idToken = await firebaseUser.getIdToken()
      setUser({
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        uid: firebaseUser.uid,
        idToken,
      })
    }

    updateUser()
  }, [firebaseUser])

  const handleLogout = useCallback<ContextType['handleLogout']>(async () => {
    await firebaseAuth.signOut()
    setUser(null)
  }, [])

  const handleDeleteAccount = useCallback<
    ContextType['handleLogout']
  >(async () => {
    if (firebaseUser) await firebaseUser.delete()
    setUser(null)
  }, [firebaseUser])

  const context = useMemo<ContextType>(
    () => ({
      loading,
      user,
      handleLogout,
      handleLoginApple,
      handleLoginGoogle,
      handleLoginPassword,
      handleDeleteAccount,
    }),
    [
      user,
      loading,
      handleLogout,
      handleLoginGoogle,
      handleLoginApple,
      handleLoginPassword,
      handleDeleteAccount,
    ]
  )

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) throw new Error('AuthContext must be used within AuthProvider')

  return context
}
