import 'react-native-gesture-handler/jestSetup'
import '@testing-library/jest-native/extend-expect'

jest.mock('react-native/Libraries/Animated/animations/TimingAnimation')
jest.mock('@expo-google-fonts/poppins', () => ({
  useFonts: jest.fn().mockReturnValue([true]),
}))
jest.mock('@expo-google-fonts/didact-gothic', () => ({
  useFonts: jest.fn().mockReturnValue([true]),
}))

jest.mock('@expo-google-fonts/fira-code', () => ({
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
