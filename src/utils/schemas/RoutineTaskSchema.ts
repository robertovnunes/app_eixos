import RoutineTask from 'interfaces/routineTask';
import Realm, { Types, List } from 'realm';
import { RealmObject as Object } from 'realm/dist/public-types/Object';

export class RoutineTaskSchema
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
    name: 'RoutineTask',
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
