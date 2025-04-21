// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    BUILD_PROFILE: 'development' | 'preview' | 'production';
  }
}
