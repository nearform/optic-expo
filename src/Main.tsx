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
  useFonts as useRobotoMono,
  RobotoMono_400Regular,
} from '@expo-google-fonts/roboto-mono'
import AppLoading from 'expo-app-loading'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'

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
    notificationId: string
  }
  Notifications: {
    //
  }
}

export default function Main() {
  const [hasPoppinsLoaded] = usePoppins({
    Poppins_700Bold,
  })

  const [hasDidactLoaded] = useDidactGothic({
    DidactGothic_400Regular,
  })

  const [hasRobotoMonoLoaded] = useRobotoMono({
    RobotoMono_400Regular,
  })

  const { user } = useAuth()

  if (!hasPoppinsLoaded || !hasDidactLoaded || !hasRobotoMonoLoaded) {
    return <AppLoading />
  }

  if (!user) {
    return <AuthScreen />
  }

  return (
    <NavigationContainer>
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
      </MainStack.Navigator>
    </NavigationContainer>
  )
}
