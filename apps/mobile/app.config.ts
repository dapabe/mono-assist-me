import type { ConfigContext, ExpoConfig } from 'expo/config';

const bundleIdentifier = 'com.denz.assist.me';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  name: 'assist-me-btn',
  slug: 'assist-me-btn',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'assistmebtn',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  ios: {
    ...config.ios,
    supportsTablet: true,
  },
  android: {
    ...config.android,
    permissions: [
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE',
      'android.permission.CHANGE_WIFI_MULTICAST_STATE',
    ],
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: bundleIdentifier,
  },
  // web: {
  //   bundler: 'metro',
  //   output: 'static',
  //   favicon: './assets/images/favicon.png',
  // },
  plugins: [
    'expo-router',
    'expo-sqlite',
    'expo-font',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
});
