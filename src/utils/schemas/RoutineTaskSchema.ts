import RoutineTaskDay, { RoutineTaskItem } from 'interfaces/routineTask';
import Realm, { List } from 'realm';
import { RealmObject as Object } from 'realm/dist/public-types/Object';

export class RoutineTaskItemSchema
  extends Realm.Object<RoutineTaskItem>
  implements RoutineTaskItem
{
  id?: string;
  taskId?: string;
  titulo!: string;
  descricao!: string | null;
  horario!: string;
  reminderTime?: number[];
  notificationIds?: string[];

  static schema = {
    name: 'RoutineTaskItem',
    primaryKey: 'id',
    properties: {
      id: 'string?',
      taskId:{ type: 'string', indexed: true } as unknown as Realm.PropertySchema,
      titulo: 'string',
      descricao: 'string?',
      horario: 'string',
      reminderTime: 'int?[]',
      notificationIds: 'string?[]',
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