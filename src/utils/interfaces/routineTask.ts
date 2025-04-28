declare module 'interfaces/routineTask' {
  
  export interface RoutineTaskItem {
    id?: string;
    titulo: string;
    descricao: string | null;
    horario: string;
    reminderTime: Realm.Types.List<number> | null;
    notificationIds?: Realm.Types.List<string> | null;
  }

  export default interface RoutineTaskDay {
    dayOfWeek: number;
    tasks: RoutineTaskItem[];
  }
}