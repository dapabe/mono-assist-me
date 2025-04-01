import type { ConfigContext, ExpoConfig } from 'expo/config';

const bundleIdentifier = 'com.denz.assist.me';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'assist-me',
  slug: 'assist-me',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'assist-me',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
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
