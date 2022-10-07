// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('./package.json')

const config = {
  API_URL: 'https://optic-zf3votdk5a-ew.a.run.app/api',
  API_KEY: 'AIzaSyBFiuUulmuQ7Pv1VvxpUQB01AWCEQhIToA',
  AUTH_DOMAIN: 'npm-otp-f6bfc.firebaseapp.com',
  DATABASE_URL: 'https://npm-otp-f6bfc.firebaseio.com',
  PROJECT_ID: 'npm-otp-f6bfc',
  STORAGE_BUCKET: 'npm-otp-f6bfc.appspot.com',
  MESSAGING_SENDER_ID: '230076165693',
  APP_ID: '1:230076165693:web:a04f9ad6f64be8ec248454',
  CLIENT_ID:
    '230076165693-0mj3vb13158tnru89f1re89m9o94g8e7.apps.googleusercontent.com',
  CLIENT_ID_ANDROID:
    '230076165693-a668m77v43bsbi0usea3p4o83ehco09r.apps.googleusercontent.com',
  CLIENT_ID_IOS:
    '230076165693-v8kk0ase89jp3s1qe0rtg70t3vb2h9i9.apps.googleusercontent.com',
  EAS_PROJECT_ID: 'e3c6e759-c8c5-41a8-861e-b3e4adab619a',
  APP_PACKAGE_ID: 'com.nearform.optic',
}

export default {
  name: 'optic',
  slug: 'optic-expo',
  owner: 'nearform',
  privacy: 'public',
  scheme: 'optic-expo',
  githubUrl: 'https://github.com/nearform/optic-expo',
  version: pkg.version,
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  extra: {
    apiUrl: config.API_URL,
    apiKey: config.API_KEY,
    authDomain: config.AUTH_DOMAIN,
    databaseURL: config.DATABASE_URL,
    projectId: config.PROJECT_ID,
    storageBucket: config.STORAGE_BUCKET,
    messagingSenderId: config.MESSAGING_SENDER_ID,
    appId: config.APP_ID,
    clientId: config.CLIENT_ID,
    androidClientId: config.CLIENT_ID_ANDROID,
    iosClientId: config.CLIENT_ID_IOS,
    eas: {
      projectId: config.EAS_PROJECT_ID,
    },
  },
  splash: {
    image: './src/assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: `https://u.expo.dev/${config.EAS_PROJECT_ID}`,
  },
  assetBundlePatterns: ['**/*'],
  platforms: ['android', 'ios'],
  ios: {
    appStoreUrl: 'https://apps.apple.com/us/app/nearform-optic/id1643969791',
    supportsTablet: true,
    bundleIdentifier: config.APP_PACKAGE_ID,
    buildNumber: String(pkg.versionCode),
    usesAppleSignIn: true,
    infoPlist: {
      NSCameraUsageDescription:
        'This app uses the camera to scan QR codes with OTP secrets',
    },
  },
  android: {
    versionCode: pkg.versionCode,
    package: config.APP_PACKAGE_ID,
    googleServicesFile: './google-services.json',
    adaptiveIcon: {
      foregroundImage: './src/assets/icon.png',
      backgroundColor: '#FFFFFF',
    },
    playStoreUrl:
      'https://play.google.com/store/apps/details?id=com.nearform.optic',
  },
  runtimeVersion: {
    policy: 'sdkVersion',
  },
}
