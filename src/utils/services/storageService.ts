// File: /storage/StorageManager.ts

import Realm from 'realm';

import Timer from 'interfaces/timer';
import RoutineTask from 'interfaces/routineTask';
import Task from 'interfaces/Task';
import { TimerSchema } from '../schemas/TimerSchema';
import { RoutineTaskSchema } from '../schemas/RoutineTaskSchema';
import { TaskSchema } from '../schemas/TaskSchema';

interface DefaultData {
  timers: Timer[];
  routineTasks: RoutineTask[][];
  tasks: Task[];
}

class StorageManager<T> {
  private realm: Realm;

  constructor() {
    this.realm = new Realm({
      path: 'eixos.realm',
      schema: [TimerSchema, RoutineTaskSchema, TaskSchema],
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
        data = this.realm.objects('RoutineTask') as unknown as DefaultData[K];
        break;
      case 'tasks':
        data = this.realm.objects('Task') as unknown as DefaultData[K];
        break;
      default:
        throw new Error(`Unknown key: ${key}`);
    }
    return data;
  }

  public addItem(schemaName: string, item: T): R {
    try {
      return this.realm.write(() => {
        const newItem = this.realm.create(schemaName, item, Realm.UpdateMode.All);
        return newItem;
      });
    }
    catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  }

  public removeItem(schemaName: string, id: string): void {
    this.realm.write(() => {
      const obj = this.realm.objectForPrimaryKey(schemaName, id);
      if (obj) {
        this.realm.delete(obj);
      }
    });
  }

  public editItem(
    schemaName: string,
    id: string,
    updatedData: Partial<T>,
  ): void {
    this.realm.write(() => {
      const obj = this.realm.objectForPrimaryKey(schemaName, id);
      if (obj) {
        Object.assign(obj, updatedData);
      }
    });
  }

  public findItemById<K extends { [key: string]: any }>(
    schemaName: string,
    id: string,
  ): K | null {
    const obj = this.realm.objectForPrimaryKey<K>(schemaName, id as any);
    return obj ? { ...obj } : null;
  }
}

const storageManager = new StorageManager();
export default storageManager;
