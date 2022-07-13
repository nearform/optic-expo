import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {
  useFonts as usePoppins,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'
import {
  useFonts as useDidactGothic,
  DidactGothic_400Regular,
} from '@expo-google-fonts/didact-gothic'
import {
  useFonts as useFiraCode,
  FiraCode_400Regular,
} from '@expo-google-fonts/fira-code'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'

import { useSplashScreen } from './hooks/use-splash-screen'
import theme from './lib/theme'
import { useAuth } from './context/AuthContext'
import { HomeScreen } from './screens/HomeScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { TypeScreen } from './screens/TypeScreen'
import { ScanScreen } from './screens/ScanScreen'
import { AuthScreen } from './screens/AuthScreen'
import HomeHeaderRight from './components/HomeHeaderRight'
import DefaultHeaderLeft from './components/DefaultHeaderLeft'
import { TokenScreen } from './screens/TokenScreen'
import { OtpRequestScreen } from './screens/OtpRequestScreen'
import { TokensListScreen } from './screens/TokensListScreen'
import { CreateTokenScreen } from './screens/CreateTokenScreen'
import { NotificationsScreen } from './screens/NotificationsScreen'

const MainStack = createStackNavigator()

export type MainStackParamList = {
  Home: undefined
  Scan: undefined
  Type: undefined
  Settings: undefined
  CreateToken: {
    secretId: string
  }
  Token: {
    secretId: string
    token: string
  }
  TokensList: {
    secretId: string
    issuer: string
  }
  OtpRequest: {
    secretId: string
    token: string
    uniqueId: string
  }
  Notifications: undefined
}

export default function Main() {
  const [hasPoppinsLoaded] = usePoppins({
    Poppins_700Bold,
  })

  const [hasDidactLoaded] = useDidactGothic({
    DidactGothic_400Regular,
  })

  const [hasFiraCodeLoaded] = useFiraCode({
    FiraCode_400Regular,
  })

  const { user } = useAuth()

  const isReady = hasPoppinsLoaded && hasDidactLoaded && hasFiraCodeLoaded
  const onReady = useSplashScreen(isReady)

  if (!isReady) {
    return null
  }

  if (!user) {
    return <AuthScreen onReady={onReady} />
  }

  return (
    <NavigationContainer onReady={onReady}>
      <MainStack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTitleStyle: {
            color: theme.colors.surface,
          },
        }}
      >
        <MainStack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Your Tokens', headerRight: HomeHeaderRight }}
        />
        <MainStack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings', headerLeft: DefaultHeaderLeft }}
        />
        <MainStack.Screen
          name="TokensList"
          component={TokensListScreen}
          options={({
            route: {
              params: { issuer },
            },
          }: NativeStackScreenProps<MainStackParamList, 'TokensList'>) => ({
            title: issuer,
            headerLeft: DefaultHeaderLeft,
          })}
        />
        <MainStack.Screen
          name="CreateToken"
          component={CreateTokenScreen}
          options={{ title: 'Create token', headerLeft: DefaultHeaderLeft }}
        />
        <MainStack.Screen
          name="Token"
          component={TokenScreen}
          options={{ title: 'Token', headerLeft: DefaultHeaderLeft }}
        />
        <MainStack.Screen
          name="OtpRequest"
          component={OtpRequestScreen}
          options={{ title: 'OTP Request', headerLeft: DefaultHeaderLeft }}
        />
        <MainStack.Screen
          name="Scan"
          component={ScanScreen}
          options={{ title: 'Scan QR Code', headerLeft: DefaultHeaderLeft }}
        />
        <MainStack.Screen
          name="Type"
          component={TypeScreen}
          options={{ title: 'New Secret', headerLeft: DefaultHeaderLeft }}
        />
        <MainStack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ title: 'Notifications', headerLeft: DefaultHeaderLeft }}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  )
}
