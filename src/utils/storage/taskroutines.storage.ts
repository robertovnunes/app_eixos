import BaseService from "./base.storage";
import RoutineTask from "interfaces/RoutineTask";

class TaskRoutinesStorage extends BaseService {
    private _realm: Realm | null = null;
    private _tasks: RoutineTask[] = [];
    constructor() {
        super();
        this.initialize();
    }
    private async initialize(): Promise<void> {
        try {
            if (!this._realm) {
                this._realm = await this.getRealm();
            }
            await this._loadTasks();
        } catch (error) {
            console.error("Erro ao inicializar TaskRoutinesStorage:", error);
        }
    }

    private async _loadTasks(): Promise<void> {
        try {
            if (!this._realm) {
                this._realm = await this.getRealm();
            }
            this._tasks = Array.from(this._realm.objects<RoutineTask>("RoutineTask"));
        } catch (error) {
            console.error("Erro ao recarregar tarefas:", error);
        }
    }

    public async getAll(): Promise<RoutineTask[] | void> {
        try {
            if (!this._realm) {
                this._realm = await this.getRealm();
            }
            return Array.from(this._tasks);
        } catch (error) {
            console.error("Erro ao obter todas as tarefas:", error);
            return [];
        }
    }
}

const taskRoutineStorage = new TaskRoutinesStorage()

export default taskRoutineStorage;
