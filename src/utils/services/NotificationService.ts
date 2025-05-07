import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { showTextInputAlert } from '../../UI/components/TextInputAlert';
import { showToast } from './toast';

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

    this.responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification response received:', response);
      });
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
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
      });
    } else if (Platform.OS === 'ios') {
      await Notifications.setNotificationChannelAsync('eixos', {
        name: 'eixos',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
      });
    }

    return token;
  }

  async scheduleWeeklyNotification(
    className: string,
    slot: string,
    time: Date,
    weekday: number,
  ): Promise<string> {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${className}`,
        body: slot,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        channelId: 'eixos',
        weekday,
        hour: hours,
        minute: minutes,
      },
    });
    return id;
  }

  async scheduleNotification(
    seconds: number,
    className: string,
    slot: string,
  ): Promise<string> {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${className}`,
        body: slot,
      },
      trigger: {
        seconds,
        channelId: 'eixos',
      },
    });
    return id;
  }

  async getAllScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    return scheduledNotifications.filter(
      (notificacao) => notificacao.content.data?.channelId === 'eixos',
    );
  }

  async cancelNotification(notifId: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(notifId);
  }

  // New method to find and cancel a specific notification by date
  async cancelSpecificNotification(date: Date): Promise<void> {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();
    // Obter o dia da semana (1 = segunda-feira, 2 = terça-feira, ..., 7 = domingo)
    const weekday = date.getDay() === 0 ? 7 : date.getDay(); // Ajuste para que domingo seja 7

    const notificationToCancel = scheduledNotifications.find(
      (notificacao) =>
        notificacao.content.data?.channelId === 'eixos' &&
        (notificacao.trigger as Notifications.WeeklyTriggerInput)?.weekday === weekday &&
        (notificacao.trigger as Notifications.WeeklyTriggerInput)?.hour === date.getHours() &&
        (notificacao.trigger as Notifications.WeeklyTriggerInput)?.minute === date.getMinutes(),    );

    if (notificationToCancel) {
      await Notifications.cancelScheduledNotificationAsync(
        notificationToCancel.identifier,
      );
      showToast('success', 'Sucesso', 'Notificação cancelada com sucesso.');
    } else {
      showToast(
        'error',
        'Erro',
        'Não foi possível encontrar a notificação para cancelar.',
      );
    }
  }

  async cancelAllScheduledNotifications(): Promise<void> {
    try {
      const confirmation = await new Promise<boolean>((resolve) => {
        showTextInputAlert({
          title: 'Confirmação',
          message:
            'Você tem certeza que deseja cancelar todas as notificações?',
          placeholder: 'Digite "sim" para confirmar',
          defaultValue: '',
          onSubmit: (text) => {
            if (text === 'sim') {
              resolve(true);
            } else {
              showToast('error', 'Erro', 'Texto inválido. Tente novamente.');
              resolve(false);
            }
          },
        });
      });

      if (confirmation) {
        const scheduledNotifications =
          await Notifications.getAllScheduledNotificationsAsync();
        const notificationIds = scheduledNotifications.filter(
          (notificacao) => notificacao.content.data?.channelId === 'eixos',
        );
        for (const notification of notificationIds) {
          await Notifications.cancelScheduledNotificationAsync(
            notification.identifier,
          );
        }
        showToast(
          'success',
          'Sucesso',
          'Todas as notificações foram canceladas com sucesso.',
        );
      }
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
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

const notificationService = new NotificationService();

export default notificationService;
