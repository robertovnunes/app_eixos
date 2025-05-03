
declare module 'interfaces/routineTask' {
  
  export interface RoutineTaskItem {
    id?: string;
    taskId?: string;
    titulo: string;
    descricao: string | null;
    horario: string;
    reminderTime?: number[] | null;
    notificationIds?: string[] | null;
  }

  export default interface RoutineTaskDay {
    dayOfWeek: number;
    tasks: RoutineTaskItem[];
  }
}