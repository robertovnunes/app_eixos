import RoutineTaskDay, { RoutineTaskItem } from 'interfaces/routineTask';
import Realm, { Types, List } from 'realm';
import { RealmObject as Object } from 'realm/dist/public-types/Object';

export class RoutineTaskItemSchema
  extends Realm.Object<RoutineTaskItem>
  implements RoutineTaskItem
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
export default class RoutineDaySchema 
extends Realm.Object<RoutineTaskDay>
  implements RoutineTaskDay {
  dayOfWeek!: number;
  tasks!: RoutineTaskItem[];

  static schema = {
    name: 'RoutineDay',
    primaryKey: 'dayOfWeek',
    properties: {
      dayOfWeek: 'int',
      tasks: 'RoutineTaskItem[]',
    },
  };
}