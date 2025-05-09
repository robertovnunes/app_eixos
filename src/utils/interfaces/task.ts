declare module 'interfaces/Task' {

    export interface SubTask {
        id: string;
        titulo: string;
        concluido: boolean;
    }

    export default interface Task {
        id: string;
        titulo: string;
        descricao: string;
        data: Date | null;
        weekday: number[] | null;
        horario: string | null;
        reminderTime?: number[] | null;
        notificationIds?: string[] | null;
        concluido: boolean;
        importante: boolean;
        urgente: boolean;
        prioridade: number;
        subtasks: SubTask[];
    }

}