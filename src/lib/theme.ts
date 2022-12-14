import { TextStyle } from 'react-native'
import { MD2LightTheme as PaperDefaultTheme } from 'react-native-paper'
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native'

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'button'
  | 'caption'
  | 'overline'
  | 'code'

const typography: Record<TypographyVariant, TextStyle> = {
  h1: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 96,
    letterSpacing: -1.5,
  },
  h2: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 60,
    letterSpacing: 0,
  },
  h3: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 48,
    letterSpacing: 0,
  },
  h4: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 34,
    letterSpacing: 0.25,
  },
  h5: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: 0,
  },
  h6: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    letterSpacing: 0.15,
  },
  subtitle1: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.15,
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.15,
  },
  body1: {
    fontFamily: 'DidactGothic_400Regular',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  body2: {
    fontFamily: 'DidactGothic_400Regular',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  button: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.4,
  },
  overline: {
    fontSize: 10,
    fontWeight: '400',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  code: {
    fontFamily: 'FiraCode_400Regular',
    fontSize: 24,
  },
}

const theme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  roundness: 4,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    primary: '#2165E3',
    text: '#6D6D68',
    textSecondary: 'rgba(0, 0, 0, 0.6)',
  },
  typography,
  spacing: (mul: number) => mul * 8,
  alpha: (color: string, op: number) =>
    `${color}${Math.round(0xff * op).toString(16)}`,
}

export default theme
