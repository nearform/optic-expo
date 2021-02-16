import { DefaultTheme } from 'react-native-paper'

const sizing = [12, 16, 20, 24, 32, 40, 64]

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2165E3',
    white: '#eee',
  },
  text: {
    large: sizing[6],
    medium: sizing[5],
    small: sizing[3],
    tiny: sizing[2],
  },
  spacing: {
    large: sizing[6],
    medium: sizing[5],
    small: sizing[3],
    tiny: sizing[2],
  },
}

export default theme
