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
  const [hasPoppinsLoaded] = usePoppins({
    Poppins_700Bold,
  })

  const [hasDidactLoaded] = useDidactGothic({
    DidactGothic_400Regular,
  })

  const { user } = useAuth()

  if (!hasPoppinsLoaded || !hasDidactLoaded) {
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
          options={{
            title: 'Your Tokens change 2',
            headerRight: HomeHeaderRight,
          }}
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
