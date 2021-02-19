import React from 'react'
import { Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import theme from '../lib/defaultTheme'
import routes from '../lib/routeDefinitions'

import Home from './Home'
import TypeNewSecret from './TypeNewSecret'
import ScanNewSecret from './ScanNewSecret'
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
          component={ScanNewSecret}
          options={{
            title: UI_STRINGS.routes.scan.title,
            headerLeft: DefaultHeaderLeft,
          }}
        />
        <Stack.Screen
          name={routes.upload.name}
          component={() => <Text>{routes.upload.name} placeholder</Text>}
          options={{
            title: UI_STRINGS.routes.upload.title,
            headerLeft: DefaultHeaderLeft,
          }}
        />
        <Stack.Screen
          name={routes.type.name}
          component={TypeNewSecret}
          options={{
            title: UI_STRINGS.routes.type.title,
            headerLeft: DefaultHeaderLeft,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
