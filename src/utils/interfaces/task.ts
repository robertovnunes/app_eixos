declare module 'interfaces/task' {

    export interface subTask {
        id: string;
        titulo: string;
        concluido: boolean;
    }

    export interface Task {
        id: string;
        titulo: string;
        descricao: string;
        data: Date | null;
        horario: string | null;
        concluido: boolean;
        importante: boolean;
        urgente: boolean;
        prioridade: number;
        subtasks: subTask[];
    }

}