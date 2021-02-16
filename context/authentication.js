import * as React from 'react'
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

const AuthenticationContext = React.createContext()

function useFirebaseAuth() {
  const [user, setUser] = React.useState()

  const [, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      '230076165693-0mj3vb13158tnru89f1re89m9o94g8e7.apps.googleusercontent.com',
  })

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params

      const credential = firebase.auth.GoogleAuthProvider.credential(id_token)
      firebase.auth().signInWithCredential(credential)
    }
  }, [response])

  React.useEffect(() => firebase.auth().onAuthStateChanged(setUser), [])

  return { user, promptAsync }
}

export function useAuthenticationContext() {
  return React.useContext(AuthenticationContext)
}

export function AuthenticationProvider({ children }) {
  const { user, promptAsync } = useFirebaseAuth()
  return (
    <AuthenticationContext.Provider
      value={{
        user,
        handleLogin: promptAsync,
        handleLogout: () => firebase.auth().signOut(),
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  )
}
