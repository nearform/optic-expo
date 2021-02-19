import { DefaultTheme } from 'react-native-paper'

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2165E3',
    text: '#6D6D68',
  },
  spacing: (multiplier = 1) => multiplier * 8,
}

export default theme
