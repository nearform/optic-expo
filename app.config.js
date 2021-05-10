import 'dotenv/config'

export default {
  expo: {
    name: 'optic-expo',
    slug: 'optic-expo',
    owner: 'nearform',
    scheme: 'optic-expo',
    entryPoint: './src/index.js',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './src/assets/icon.png',
    extra: {
      apiUrl: process.env.API_URL,
    },
    splash: {
      image: './src/assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
    },
    web: {
      favicon: './src/assets/favicon.png',
    },
  },
}
