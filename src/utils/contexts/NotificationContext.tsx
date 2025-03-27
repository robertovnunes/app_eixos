import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useContext,
} from 'react';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

interface NotificationState {
  expoPushToken: string;
  schedulePushNotification: (
    className: string,
    slot: string,
    type: string,
    time: Date,
    day: string,
  ) => Promise<string>;
  cancelNotification: (notifId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationState | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<any>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, schedulePushNotification, cancelNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
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

export async function schedulePushNotification(
  className: string,
  slot: string,
  type: string,
  time: Date,
  day: string,
): Promise<string> {
  time = new Date(time.getTime() - 5 * 60000);
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const weekday = days.indexOf(day) + 1;
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `${className} ${type}`,
      body: slot,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday,
      hour: hours,
      minute: minutes,
    },
  });
  console.log('Notification scheduled with ID:', id);
  return id;
}

export async function cancelNotification(notifId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notifId);
}
