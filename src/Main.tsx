import {
  DidactGothic_400Regular,
  useFonts as useDidactGothic,
} from '@expo-google-fonts/didact-gothic'
import {
  FiraCode_400Regular,
  useFonts as useFiraCode,
} from '@expo-google-fonts/fira-code'
import {
  Poppins_700Bold,
  useFonts as usePoppins,
} from '@expo-google-fonts/poppins'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect } from 'react'

import DefaultHeaderLeft from './components/DefaultHeaderLeft'
import HomeHeaderRight from './components/HomeHeaderRight'
import { useAuth } from './context/AuthContext'
import theme from './lib/theme'
import { AuthScreen } from './screens/AuthScreen'
import { CreateTokenScreen } from './screens/CreateTokenScreen'
import { ExportFileSecret } from './screens/ExportFileSecret'
import { HomeScreen } from './screens/HomeScreen'
import { ImportFileSecret } from './screens/ImportFileSecret'
import { NotificationsScreen } from './screens/NotificationsScreen'
import { OtpRequestScreen } from './screens/OtpRequestScreen'
import { ScanScreen } from './screens/ScanScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { TokenScreen } from './screens/TokenScreen'
import { TokensListScreen } from './screens/TokensListScreen'
import { TypeScreen } from './screens/TypeScreen'

const MainStack = createStackNavigator<MainStackParamList>()

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
    packageInfo?: {
      name?: string
      version?: string
    }
  }
  Notifications: undefined
  ExportFileSecret: undefined
  ImportFileSecret: {
    fileContent: string
  }
}

SplashScreen.preventAutoHideAsync()

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

  const { user, loading } = useAuth()

  useEffect(() => {
    if (hasPoppinsLoaded && hasDidactLoaded && hasFiraCodeLoaded && !loading) {
      SplashScreen.hide()
    }
  }, [hasDidactLoaded, hasFiraCodeLoaded, hasPoppinsLoaded, loading])

  if (!hasPoppinsLoaded || !hasDidactLoaded || !hasFiraCodeLoaded || loading) {
    return null
  }

  if (!user) {
    return <AuthScreen />
  }

  return (
    <NavigationContainer>
      <MainStack.Navigator
        id={undefined} // FIXME: diagnose this properly and remove
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTitleStyle: {
            color: theme.colors.surface,
          },
          freezeOnBlur: true,
          headerTintColor: theme.colors.surface,
          headerPressColor: 'rgba(255, 255, 255, 0.32)',
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
          }: StackScreenProps<MainStackParamList, 'TokensList'>) => ({
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
        <MainStack.Screen
          name="ExportFileSecret"
          component={ExportFileSecret}
          options={{
            title: 'Encrypt Exported Tokens',
          }}
        />
        <MainStack.Screen
          name="ImportFileSecret"
          component={ImportFileSecret}
          options={{ title: "Decrypt Secret's File" }}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  )
}
