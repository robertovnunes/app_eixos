import Timer, { Duration } from 'interfaces/timer';
import Realm from 'realm';
import { RealmObject as Object } from 'realm/dist/public-types/Object';

class DurationSchema extends Realm.Object<Duration> implements Duration {
  minutes!: number;
  seconds!: number;

  static schema = {
    name: 'Duration',
    embedded: true,
    properties: {
      minutes: 'int',
      seconds: 'int',
    },
  };
}

// Define Realm Object Schemas
export class TimerSchema extends Realm.Object<Timer> implements Timer {
  id!: string;
  name!: string;
  focusDuration!: Duration;
  shortBreakDuration!: Duration;
  longBreakDuration!: Duration;
  loops!: number;
  isDefault?: boolean;

  static schema = {
    name: 'Timer',
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      focusDuration: 'Duration',
      shortBreakDuration: 'Duration',
      longBreakDuration: 'Duration',
      loops: 'int',
      isDefault: { type: 'bool', optional: true },
    },
  };
}
