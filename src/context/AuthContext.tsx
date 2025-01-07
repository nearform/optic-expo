import * as AppleAuthentication from 'expo-apple-authentication'
import * as Google from 'expo-auth-session/providers/google'
import Constants from 'expo-constants'
import * as WebBrowser from 'expo-web-browser'
import { initializeApp } from 'firebase/app'
import {
  User as FirebaseUser,
  getAuth,
  GoogleAuthProvider,
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

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

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

// FIXME: likely not needed any more, remove once auth is working
const projectNameForProxy = `@${Constants.expoConfig.owner}/${Constants.expoConfig.slug}`

function useGoogleAuth() {
  const [, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId,
    androidClientId,
    iosClientId,
  })

  const login = useCallback<ContextType['handleLoginGoogle']>(
    () => promptAsync(), // FIXME: swap to development build and custom uri scheme
    [promptAsync],
  )

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params
      const credentials = GoogleAuthProvider.credential(id_token)
      signInWithCredential(auth, credentials)
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
      signInWithCredential(auth, credentials)
    } catch (e) {
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
    ],
  )

  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) throw new Error('AuthContext must be used within AuthProvider')

  return context
}
