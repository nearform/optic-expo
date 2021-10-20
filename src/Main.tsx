import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import {
  useFonts as useRoboto,
  Roboto_300Light,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import AppLoading from 'expo-app-loading'

import theme from './lib/theme'
import { useAuth } from './context/AuthContext'
import { HomeScreen } from './screens/HomeScreen'
import { TypeScreen } from './screens/TypeScreen'
import { ScanScreen } from './screens/ScanScreen'
import { AuthScreen } from './screens/AuthScreen'
import HomeHeaderRight from './components/HomeHeaderRight'
import DefaultHeaderLeft from './components/DefaultHeaderLeft'

const MainStack = createStackNavigator()

export type MainStackParamList = {
  Home: undefined
  Scan: undefined
  Type: undefined
}

export default function Main() {
  const [hasRobotoLoaded] = useRoboto({
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  })

  const { user } = useAuth()

  if (!hasRobotoLoaded) {
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
