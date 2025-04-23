import AlarmModule, {
  removeAlarm,
  scheduleAlarm,
  stopAlarm,
} from 'expo-alarm-module';
import { AlarmSettings } from 'expo-alarm-module/lib/typescript/src/types/Alarm.types';

import { Platform } from 'react-native';

class AlarmService {
  async schedule(alarm: AlarmSettings) {
    if (Platform.OS === 'android') {
      await scheduleAlarm(alarm);
    } else if (Platform.OS === 'ios') {
      await scheduleAlarm(alarm);
    }
  }

  async remove(uid: string) {
    if (Platform.OS === 'android') {
      await removeAlarm(uid);
    } else if (Platform.OS === 'ios') {
      await removeAlarm(uid);
    }
  }

  async stop() {
    if (Platform.OS === 'android') {
      await stopAlarm();
    } else if (Platform.OS === 'ios') {
      await stopAlarm();
    }
  }
}

const alarmService = new AlarmService();

export default alarmService;