import 'dotenv/config'

const APP_PACKAGE_ID = process.env.APP_PACKAGE_ID || 'com.nearform.optic'

export default {
  name: 'optic',
  slug: 'optic-expo',
  owner: 'nearform',
  scheme: 'optic',
  version: '1.0.2',
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
    androidClientId: process.env.CLIENT_ID_ANDROID,
    iosClientId: process.env.CLIENT_ID_IOS,
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
    bundleIdentifier: APP_PACKAGE_ID,
  },
  android: {
    package: APP_PACKAGE_ID,
    adaptiveIcon: {
      foregroundImage: './src/assets/icon.png',
      backgroundColor: '#FFFFFF',
    },
  },
  runtimeVersion: {
    policy: 'sdkVersion',
  },
}
