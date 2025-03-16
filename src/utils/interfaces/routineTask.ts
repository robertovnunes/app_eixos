declare module 'interfaces/routineTask' {
    
    export interface RoutineTask {
      id?: string;
      titulo: string;
      descricao: string | null;
      diasDaSemana: string[];
      horario: String | null;
      reminderTime: number | null;
      notificationIds?: string[] | null;
    }
    
}