declare module 'interfaces/routineTask' {
    
    export interface RoutineTask {
      id?: string;
      titulo: string;
      descricao: string | null;
      diasDaSemana: string[];
      horario: Date;
      reminderTime: number | null;
      notificationIds?: string[] | null;
    }
    
}