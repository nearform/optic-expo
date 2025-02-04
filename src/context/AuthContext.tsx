import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import * as GS from '@react-native-google-signin/google-signin'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import * as AppleAuthentication from 'expo-apple-authentication'
import Constants from 'expo-constants'
import { FirebaseOptions, initializeApp } from 'firebase/app'
import {
  User as FirebaseUser,
  getReactNativePersistence,
  GoogleAuthProvider,
  initializeAuth,
  OAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useAsyncCallback } from 'react-async-hook'
import { Alert } from 'react-native'

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
  // androidClientId, // NOTE: now unused?
  iosClientId,
} = Constants.expoConfig?.extra as FirebaseSettings

const firebaseConfig: FirebaseOptions = {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
}

const app = initializeApp(firebaseConfig)
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
})

GoogleSignin.configure({
  webClientId: clientId,
  iosClientId,
})

type ContextType = {
  loading: boolean
  user: User | null
  handleLoginGoogle: () => void
  handleLoginApple: () => void
  handleLoginPassword: (credentials: {
    user: string
    password: string
  }) => Promise<void>
  handleLogout: () => Promise<void>
  handleDeleteAccount: () => Promise<void>
}

const AuthContext = React.createContext<ContextType | undefined>(undefined)

type AuthenticationProviderProps = {
  children: React.ReactNode
}

function useGoogleAuth() {
  const { execute: login, result } = useAsyncCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const response = await GoogleSignin.signIn()
      if (GS.isSuccessResponse(response)) {
        return { userInfo: response.data }
      } else {
        Alert.alert('Error', 'Google sign in cancelled')
      }
    } catch (error) {
      if (GS.isErrorWithCode(error)) {
        switch (error.code) {
          case GS.statusCodes.IN_PROGRESS:
            Alert.alert('Error', 'Google auth already in progress')
            break
          case GS.statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Alert.alert('Error', 'Google play services not available')
            break
          default:
            Alert.alert('Error', 'Google sign in error: ' + error)
        }
      } else {
        Alert.alert('Error', 'An unexpected error occurred: ' + error)
      }
    }
  })

  useEffect(() => {
    if (result) {
      const { idToken } = result.userInfo
      const credentials = GoogleAuthProvider.credential(idToken)
      signInWithCredential(auth, credentials)
    }
  }, [result])

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
      signInWithCredential(auth, credentials)
    } catch {
      // do nothing
    }
  }, [])

  return login
}

function usePasswordAuth() {
  return useCallback(async ({ user, password }) => {
    await signInWithEmailAndPassword(auth, user, password)
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
    const unsubscribe = onAuthStateChanged(auth, newFirebaseUser => {
      setLoading(false)
      setFirebaseUser(newFirebaseUser)
    })
    return () => unsubscribe()
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
    await signOut(auth)
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
