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
import { useAssets } from 'expo-asset'

import theme from '../lib/defaultTheme'
import routes from '../lib/routeDefinitions'
import { useAuthentication } from '../context/authentication'
import { useSecrets } from '../context/secrets'

import Home from './screens/Home'
import TypeNewSecretScreen from './screens/TypeNewSecretScreen'
import ScanNewSecretScreen from './screens/ScanNewSecretScreen'
import UploadNewSecretScreen from './screens/UploadNewSecretScreen'
import Auth from './Auth'
import HomeHeaderRight from './HomeHeaderRight'
import DefaultHeaderLeft from './DefaultHeaderLeft'

const Stack = createStackNavigator()

const UI_STRINGS = {
  routes: {
    home: {
      title: 'Your Tokens',
    },
    scan: {
      title: 'Scan QR Code',
    },
    upload: {
      title: 'Upload QR Code',
    },
    type: {
      title: 'New Secret',
    },
  },
}

export default function Main() {
  const [assets] = useAssets([require('../assets/google.png')])

  const [hasPoppinsLoaded] = usePoppins({
    Poppins_700Bold,
  })

  const [hasDidactLoaded] = useDidactGothic({
    DidactGothic_400Regular,
  })

  const { isInitialized } = useSecrets()

  const { user } = useAuthentication()

  if (!assets || !hasDidactLoaded || !hasPoppinsLoaded || !isInitialized) {
    return <AppLoading />
  }

  if (!user) {
    return <Auth />
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        {...{
          initialRouteName: routes.home.name,
          screenOptions: {
            headerStyle: {
              backgroundColor: theme.colors.primary,
            },
            headerTitleStyle: {
              color: theme.colors.surface,
            },
          },
        }}
      >
        <Stack.Screen
          name={routes.home.name}
          component={Home}
          options={{
            title: UI_STRINGS.routes.home.title,
            headerRight: HomeHeaderRight,
          }}
        />
        <Stack.Screen
          name={routes.scan.name}
          component={ScanNewSecretScreen}
          options={{
            title: UI_STRINGS.routes.scan.title,
            headerLeft: DefaultHeaderLeft,
          }}
        />
        <Stack.Screen
          name={routes.upload.name}
          component={UploadNewSecretScreen}
          options={{
            title: UI_STRINGS.routes.upload.title,
            headerLeft: DefaultHeaderLeft,
          }}
        />
        <Stack.Screen
          name={routes.type.name}
          component={TypeNewSecretScreen}
          options={{
            title: UI_STRINGS.routes.type.title,
            headerLeft: DefaultHeaderLeft,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
