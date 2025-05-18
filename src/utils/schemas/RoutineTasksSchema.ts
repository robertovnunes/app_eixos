import RoutineTask from "interfaces/RoutineTask";
import Realm from "realm";

export default class RoutineTasksSchema extends Realm.Object<RoutineTask> implements RoutineTask {
    id!: string;
    titulo!: string;
    descricao!: string;
    weekday?: number[] | null;
    horario!: string | null;
    reminderTime?: number[] | null;
    notificationIds?: string[] | null;
    lastRun!: Date;
    nextRun!: Date;

    
    static schema = {
        name: 'RoutineTask',
        primaryKey: 'id',
        properties: {
        id: 'string',
        titulo: 'string',
        descricao: 'string',
        weekday: 'int[]?',
        horario: 'string?',
        reminderTime: 'int[]?',
        notificationIds: 'string[]?',
        lastRun: 'date',
        nextRun: 'date',
        },
    };
}
