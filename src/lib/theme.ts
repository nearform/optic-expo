import { TextStyle, Platform } from 'react-native'
import {
  DefaultTheme as PaperDefaultTheme,
  configureFonts,
} from 'react-native-paper'
import { DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native'

const fontConfig = {
  web: {
    regular: {
      fontFamily: 'Roboto',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'Roboto',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'Roboto',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'Roboto',
      fontWeight: '100' as const,
    },
  },
  ios: {
    regular: {
      fontFamily: 'Roboto',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'Roboto',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'Roboto',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'Roboto',
      fontWeight: '100' as const,
    },
  },
  android: {
    regular: {
      fontFamily: 'Roboto',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'Roboto',
      fontWeight: '500' as const,
    },
    light: {
      fontFamily: 'Roboto',
      fontWeight: '300' as const,
    },
    thin: {
      fontFamily: 'Roboto',
      fontWeight: '100' as const,
    },
  },
}

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'body1'
  | 'body2'
  | 'button'
  | 'caption'
  | 'overline'

const typography: Record<TypographyVariant, TextStyle> = {
  h1: {
    fontSize: 96,
    fontWeight: '300',
    letterSpacing: -1.5,
  },
  h2: {
    fontSize: 60,
    fontWeight: '300',
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 0,
  },
  h4: {
    fontSize: 34,
    fontWeight: '300',
    letterSpacing: 0.25,
  },
  h5: {
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 36,
    letterSpacing: 0,
  },
  h6: {
    fontSize: 20,
    fontWeight: '300',
    letterSpacing: 0.15,
  },
  subtitle1: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.15,
  },
  body1: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
  },
  body2: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 0.25,
  },
  button: {
    fontSize: 16,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.4,
  },
  overline: {
    fontSize: 10,
    textTransform: 'uppercase',
    fontWeight: '400',
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
    textSecondary: '#CCCCCC',
  },
  fonts: configureFonts(fontConfig),
  typography,
  spacing: (mul: number) => mul * 8,
  alpha: (color: string, op: number) =>
    `${color}${Math.round(0xff * op).toString(16)}`,
}

export default theme
