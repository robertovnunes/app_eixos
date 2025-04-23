declare module 'interfaces/user' {


  interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    notificationsEnabled: boolean;
    defaultTimerID: string;
  }

  export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface UserProfile {
    id: string;
    name: string;
    email: string;
    profilePictureUrl?: string;
    userSettings: UserPreferences;
  }
}
