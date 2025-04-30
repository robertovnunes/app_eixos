
declare module 'interfaces/routineTask' {
  import { List } from "realm";
  
  export interface RoutineTaskItem {
    id?: string;
    taskId?: string;
    titulo: string;
    descricao: string | null;
    horario: string;
    reminderTime?: number[] | null;
    notificationIds: string[] | null;
  }

  export default interface RoutineTaskDay {
    dayOfWeek: number;
    tasks: RoutineTaskItem[];
  }
}