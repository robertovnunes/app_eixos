declare module 'interfaces/RoutineTask' {

  export default interface RoutineTask {
    id: string;
    titulo: string;
    descricao: string;
    weekday?: number[] | null;
    horario: string | null;
    reminderTime?: number[] | null;
    notificationIds?: string[] | null;
    lastRun: Date;
    nextRun: Date;
  }

}