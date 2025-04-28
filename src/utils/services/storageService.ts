// File: /storage/StorageManager.ts

import Realm from 'realm';

import TimerSchema, { DurationSchema } from '../schemas/TimerSchema';
import RoutineDaySchema from '../schemas/RoutineTaskSchema';
import { TaskSchema } from '../schemas/TaskSchema';

class StorageManager {
  private realm: Realm | null = null;

  private config: Realm.Configuration;

  constructor() {
    this.config = {
      path: 'eixos.realm',
      schema: [RoutineDaySchema, TimerSchema, DurationSchema, TaskSchema],
      schemaVersion: 1,
      deleteRealmIfMigrationNeeded: true,
    };
  }

  async getRealmInstance(): Promise<Realm> {
    if (this.realm && !this.realm.isClosed) {
      return this.realm;
    }
    this.realm = await Realm.open();
    return this.realm;
  }
}

const storageManager = new StorageManager();
export default storageManager;
