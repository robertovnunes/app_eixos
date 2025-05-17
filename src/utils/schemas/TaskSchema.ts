import Task, { SubTask } from 'interfaces/Task';
import Realm from 'realm';
import { RealmObject as Object } from 'realm/dist/public-types/Object';

export class SubTaskSchema extends Realm.Object<SubTask> implements SubTask {
  id!: string;
  titulo!: string;
  concluido!: boolean;

  static schema = {
    name: 'SubTask',
    embedded: true,
    properties: {
      id: 'string',
      titulo: 'string',
      concluido: 'bool',
    },
  };
}

export default class TaskSchema extends Realm.Object<Task> implements Task {
  id!: string;
  titulo!: string;
  descricao!: string;
  data!: Date | null;
  horario!: string | null;
  reminderTime?: number[] | null;
  notificationIds?: string[] | null;
  concluido!: boolean;
  importante!: boolean;
  urgente!: boolean;
  prioridade!: number;
  subtasks!: SubTask[];

  static schema = {
    name: 'Task',
    primaryKey: 'id',
    properties: {
      id: 'string',
      titulo: 'string',
      descricao: 'string',
      data: 'date?',
      horario: 'string?',
      reminderTime: 'int?[]',
      notificationIds: 'string?[]',
      concluido: 'bool',
      importante: 'bool',
      urgente: 'bool',
      prioridade: 'int',
      subtasks: 'SubTask[]',
    },
  };
}
