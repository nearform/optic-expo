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
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      databaseURL: process.env.DATABASE_URL,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
      clientId: process.env.CLIENT_ID,
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
    platforms: ['android', 'ios'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
    },
  },
}
