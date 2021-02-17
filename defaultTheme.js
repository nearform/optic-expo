import { DefaultTheme } from 'react-native-paper'

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2165E3',
    white: '#eee',
  },
  spacing: (multiplier = 1) => multiplier * 8,
}

export default theme
