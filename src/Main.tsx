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

import theme from './lib/defaultTheme'
import routes from './lib/routeDefinitions'
import { useAuthentication } from './context/authentication'
import { useSecrets } from './context/secrets'
import { HomeScreen } from './screens/Home'
import { TypeScreen } from './screens/TypeScreen'
import { ScanScreen } from './screens/ScanScreen'
import Auth from './components/Auth'
import HomeHeaderRight from './components/HomeHeaderRight'
import DefaultHeaderLeft from './components/DefaultHeaderLeft'

const MainStack = createStackNavigator()

export type MainStackParamList = {
  Home: undefined
  Scan: undefined
  Type: undefined
}

const UI_STRINGS = {
  routes: {
    home: {
      title: 'Your Tokens',
    },
    scan: {
      title: 'Scan QR Code',
    },
    type: {
      title: 'New Secret',
    },
  },
}

export default function Main() {
  const [hasPoppinsLoaded] = usePoppins({
    Poppins_700Bold,
  })

  const [hasDidactLoaded] = useDidactGothic({
    DidactGothic_400Regular,
  })

  const { isInitialized } = useSecrets()

  const { user, loading, handleLogin } = useAuthentication()

  if (!hasDidactLoaded || !hasPoppinsLoaded || !isInitialized || loading) {
    return <AppLoading />
  }

  if (!user) {
    return <Auth {...{ handleLogin }} />
  }

  return (
    <NavigationContainer>
      <MainStack.Navigator
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
        <MainStack.Screen
          name={routes.home.name}
          component={HomeScreen}
          options={{
            title: UI_STRINGS.routes.home.title,
            headerRight: HomeHeaderRight,
          }}
        />
        <MainStack.Screen
          name={routes.scan.name}
          component={ScanScreen}
          options={{
            title: UI_STRINGS.routes.scan.title,
            headerLeft: DefaultHeaderLeft,
          }}
        />
        <MainStack.Screen
          name={routes.type.name}
          component={TypeScreen}
          options={{
            title: UI_STRINGS.routes.type.title,
            headerLeft: DefaultHeaderLeft,
          }}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  )
}
