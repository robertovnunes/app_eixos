import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const buildProfile = process.env.BUILD_PROFILE || 'preview';

  const isDev = buildProfile === 'development';
  const isPreview = buildProfile === 'preview';

  const name = isDev ? 'Eixos (Dev)' : isPreview ? 'Eixos (Preview)' : 'Eixos';
  const slug = isDev ? 'eixos-dev' : isPreview ? 'eixos-preview' : 'eixos';
  const androidPackage = isDev
    ? 'com.eixos.dev'
    : isPreview
      ? 'com.eixos.preview'
      : 'com.eixos';

  return {
    ...config,
    name,
    slug,
    version: '1.0.0.01d',
    sdkVersion: '52.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    splash: {
      backgroundColor: '#000000',
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      package: androidPackage,
      permissions: ['android.permission.SCHEDULE_EXACT_ALARM'],
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      eas: {
        projectId: '1c4b297b-7e18-4d54-be2b-f4cae6f5b29c',
      },
    },
    owner: 'roberto.vnunes',
  };
};
