// File: /storage/StorageManager.ts

import Realm from 'realm';

import TimerSchema, { DurationSchema } from '../schemas/TimerSchema';
import TaskSchema, { SubTaskSchema } from '../schemas/TaskSchema';
import RotinaSchema from '../schemas/RoutineSchema';

class StorageManager {
  private realm: Realm | null = null;

  private config: Realm.Configuration;

  constructor() {
    this.config = {
      path: 'eixos.realm',
      schema: [ TimerSchema, DurationSchema, TaskSchema, SubTaskSchema, RotinaSchema],
      schemaVersion: 1,
      deleteRealmIfMigrationNeeded: true,
    };
  }

  async getRealmInstance(): Promise<Realm> {
    if (!this.realm) {
      this.realm = await Realm.open(this.config);
    }
    return this.realm;
  }

  // Opcional: método para fechar a conexão quando necessário
  closeRealm() {
    if (this.realm && !this.realm.isClosed) {
      this.realm.close();
      this.realm = null;
    }
  }
}

const storageManager = new StorageManager();
export default storageManager;
