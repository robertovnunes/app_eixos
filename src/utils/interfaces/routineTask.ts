declare module 'interfaces/routineTask' {
  
  export default interface RoutineTask {
    id?: string;
    titulo: string;
    descricao: string | null;
    horario: string;
    reminderTime: Realm.Types.List<number> | null;
    notificationIds?: Realm.Types.List<string> | null;
  }

}