/* eslint-disable @typescript-eslint/no-var-requires */

import 'react-native-gesture-handler/jestSetup'
import { setUpTests } from 'react-native-reanimated/src/reanimated2/jestUtils'

// Setup reanimated
setUpTests()
global.__reanimatedWorkletInit = jest.fn()
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock')
  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {
    /** */
  }

  return Reanimated
})

// This is mocked to silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

jest.mock('@expo-google-fonts/poppins', () => ({
  useFonts: jest.fn().mockReturnValue([true]),
}))
jest.mock('@expo-google-fonts/didact-gothic', () => ({
  useFonts: jest.fn().mockReturnValue([true]),
}))

jest.mock('@expo-google-fonts/roboto-mono', () => ({
  useFonts: jest.fn().mockReturnValue([true]),
}))

jest.mock('expo-auth-session/providers/google')
jest.mock('expo-constants', () => ({
  manifest: { extra: { apiUrl: 'http://dummy.com/api' } },
}))
jest.mock('firebase')

jest.mock('./src/context/AuthContext')
jest.mock('./src/context/SecretsContext')
jest.mock('./src/lib/secure-storage/storage')
