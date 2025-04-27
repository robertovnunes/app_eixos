// File: /storage/StorageManager.ts

import Realm from 'realm';

import Timer from 'interfaces/timer';
import RoutineTask from 'interfaces/routineTask';
import Task from 'interfaces/Task';
import { TimerSchema } from '../schemas/TimerSchema';
import RoutineDaySchema from '../schemas/RoutineTaskSchema';
import { TaskSchema } from '../schemas/TaskSchema';

interface DefaultData {
  timers: Timer[];
  routineTasks: { dayOfWeek: number; tasks: RoutineTask[] }[];
  tasks: Task[];
}

class StorageManager<T> {
  private realm: Realm;

  constructor() {
    this.realm = new Realm({
      path: 'eixos.realm',
      schema: [TimerSchema, RoutineDaySchema, TaskSchema],
      schemaVersion: 1,
      deleteRealmIfMigrationNeeded: true,
    } as Realm.Configuration);
  }

  public getStorageData<K extends keyof DefaultData>(key: K): DefaultData[K] {
    let data: DefaultData[K] = [] as DefaultData[K];
    switch (key) {
      case 'timers':
        data = this.realm.objects('Timer') as unknown as DefaultData[K];
        break;
      case 'routineTasks':
        data = this.realm.objects('RoutineDay') as unknown as DefaultData[K];
        break;
      case 'tasks':
        data = this.realm.objects('Task') as unknown as DefaultData[K];
        break;
      default:
        throw new Error(`Unknown key: ${key}`);
    }
    return data;
  }

  getRealmInstance() {
    return this.realm;
  }
}

const storageManager = new StorageManager();
export default storageManager;
