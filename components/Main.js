import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import theme from '../lib/defaultTheme'
import routes from '../lib/routeDefinitions'
import { useAuthentication } from '../context/authentication'
import { useSecrets } from '../context/secrets'

import Auth from './Auth'
import Home from './screens/Home'
import TypeNewSecretScreen from './screens/TypeNewSecretScreen'
import ScanNewSecretScreen from './screens/ScanNewSecretScreen'
import UploadNewSecretScreen from './screens/UploadNewSecretScreen'
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
  const { user, handleLogin } = useAuthentication()

  const { isInitialized } = useSecrets()

  if (!user || !isInitialized) {
    return <Auth {...{ handleLogin }} />
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
