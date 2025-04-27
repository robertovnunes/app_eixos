import RoutineTask from 'interfaces/routineTask';
import Realm, { Types, List } from 'realm';
import { RealmObject as Object } from 'realm/dist/public-types/Object';

export class RoutineTaskItemSchema
  extends Realm.Object<RoutineTask>
  implements RoutineTask
{
  id?: string;
  titulo!: string;
  descricao!: string | null;
  horario!: string;
  reminderTime!: Realm.Types.List<number> | null;
  notificationIds?: Realm.Types.List<string> | null;

  static schema = {
    name: 'RoutineTaskItem',
    primaryKey: 'id',
    properties: {
      id: 'string?',
      titulo: 'string',
      descricao: 'string?',
      horario: 'string',
      reminderTime: 'int[]?',
      notificationIds: 'string[]?',
    },
  };
}

// Schema para o dia da semana
export default class RoutineDaySchema extends Realm.Object {
  dayOfWeek!: number;
  tasks!: Realm.List<RoutineTaskItemSchema>;

  static schema = {
    name: 'RoutineDay',
    primaryKey: 'dayOfWeek',
    properties: {
      dayOfWeek: 'int',
      tasks: 'RoutineTaskItem[]',
    },
  };
}