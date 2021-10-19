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

type User = {
  name: string | null
  uid: string
  idToken: string
}

type ContextType = {
  loading: boolean
  user: User | null
  handleLogin: () => void
  handleLogout: () => Promise<void>
}

const initialContext: ContextType = {
  loading: true,
  user: null,
  handleLogin: () => {
    // @todo
  },
  handleLogout: async () => {
    // @todo
  },
}

const AuthenticationContext = createContext<ContextType>(initialContext)

type AuthenticationProviderProps = {
  children: React.ReactNode
}

export const AuthenticationProvider: React.FC<AuthenticationProviderProps> = ({
  children,
}) => {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

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

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async firebaseUser => {
      setLoading(false)
      if (!firebaseUser) return

      setUser({
        name: firebaseUser.displayName,
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

  const value = useMemo<ContextType>(
    () => ({
      loading,
      user,
      handleLogout,
      handleLogin,
    }),
    [user, loading, handleLogout, handleLogin]
  )

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  )
}

export function useAuthentication() {
  return useContext(AuthenticationContext)
}
