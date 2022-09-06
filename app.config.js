import 'dotenv/config'

export default {
  name: 'optic-expo',
  slug: 'optic-expo',
  owner: 'nearform',
  scheme: 'optic-expo',
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
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
  },
  splash: {
    image: './src/assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: 'https://u.expo.dev/e3c6e759-c8c5-41a8-861e-b3e4adab619a',
  },
  assetBundlePatterns: ['**/*'],
  platforms: ['android', 'ios'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.nearfrom.optic',
  },
  android: {
    package: 'com.nearfrom.optic',
    adaptiveIcon: {
      foregroundImage: './src/assets/icon.png',
      backgroundColor: '#FFFFFF',
    },
  },
  runtimeVersion: {
    policy: 'sdkVersion',
  },
}
