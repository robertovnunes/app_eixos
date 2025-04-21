import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const buildProfile = process.env.BUILD_PROFILE;

  const isDev = buildProfile === 'development';
  const isPreview = buildProfile === 'preview';

  const name = isDev ? 'Eixos (Dev)' : isPreview ? 'Eixos (Preview)' : 'Eixos';
  const slug = isDev ? 'eixos-dev' : isPreview ? 'eixos-preview' : 'eixos';
  const androidPackage = isDev
    ? 'com.roberto.eixos.dev'
    : isPreview
      ? 'com.roberto.eixos.preview'
      : 'com.roberto.eixos';

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
        projectId: 'dddf0db0-88f5-4e6e-956b-20f631dc7a51',
      },
    },
    owner: 'roberto.vnunes',
  };
};
