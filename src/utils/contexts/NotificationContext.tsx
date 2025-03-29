import React, { createContext, useContext } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Device from 'expo-device';

interface NotificationState {
  expoPushToken: string;
  schedulePushNotification: (
    className: string,
    slot: string,
    time: Date,
    day: string,
  ) => Promise<string>;
  cancelNotification: (notifId: string) => Promise<void>;
}

class NotificationService {
  expoPushToken: string = '';
  notificationListener: any;
  responseListener: any;

  constructor() {
    this.initialize();
  }

  async initialize() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    this.expoPushToken = await this.registerForPushNotificationsAsync();

    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
      },
    );

    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification response received:', response);
      },
    );
  }

  async registerForPushNotificationsAsync(): Promise<string> {
    let token = '';
    if (Device.deviceType) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return '';
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo Push Token:', token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('eixos', {
        name: 'eixos',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
      });
    }

    return token;
  }

  async schedulePushNotification(
    className: string,
    slot: string,
    time: Date,
    day: string,
  ): Promise<string> {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const weekday = days.indexOf(day);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    console.log('weekday', weekday, 'hours', hours, 'minutes', minutes);
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${className}`,
        body: slot,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        channelId: 'eixos',
        weekday: weekday + 1,
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
    console.log('Notification scheduled with ID:', id);
    return id;
  }

  async cancelNotification(notifId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notifId);
  }

  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }
}

const NotificationContext = createContext<NotificationState>({
  expoPushToken: '',
  schedulePushNotification: async () => '',
  cancelNotification: async () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const notificationService = new NotificationService();

  React.useEffect(() => {
    return () => {
      notificationService.cleanup();
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken: notificationService.expoPushToken,
        schedulePushNotification: notificationService.schedulePushNotification.bind(
          notificationService,
        ),
        cancelNotification: notificationService.cancelNotification.bind(
          notificationService,
        ),
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
