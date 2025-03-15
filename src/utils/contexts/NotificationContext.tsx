import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';

interface NotificationState {
  scheduleNotification: (
    notification: Notifications.NotificationRequestInput,
  ) => Promise<string>;
  cancelNotification: (notificationId: string) => Promise<void>; 
  cancelAllNotifications: () => Promise<void>;
  getPendingNotifications: () => Promise<Notifications.NotificationRequest[]>;
}

const NotificationContext = createContext<NotificationState | undefined>(
  undefined,
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const scheduleNotification = useCallback(
    async (notification: Notifications.NotificationRequestInput) => {
      const id = await Notifications.scheduleNotificationAsync(notification);
      return id;
    },
    [],
  );

  const cancelNotification = useCallback(async (notificationId: string) => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }, []);

  const cancelAllNotifications = useCallback(async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }, []);

  const getPendingNotifications = useCallback(async () => {
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync();
    return notifications;
  }, []);

  const contextValue: NotificationState = {
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    getPendingNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );
  }
  return context;
};
