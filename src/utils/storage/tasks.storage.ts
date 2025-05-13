import BaseService from "./base.storage";
import Realm from "realm";
import Task, { SubTask } from "interfaces/Task";

class TaskStorage extends BaseService {
  private _realm: Realm | null = null;
  private _tasks: Task[] = [];

  constructor() {
    super();
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      if (!this._realm) {
        this._realm = await this.getRealm();
      }
      this._tasks = await this.getAll();
    } catch (error) {
      console.error("Erro ao inicializar TaskStorage:", error);
    }
  }

  public async getAll(): Promise<Task[]> {
    try {
        if (!this._realm) {
        this._realm = await this.getRealm();
        }
        const tasks = Array.from(this._realm.objects<Task>("Task"));
        return tasks.map((task) => ({
            ...task,
            subTasks: task.subtasks ? Array.from(task.subtasks) : [],
        }));
    } catch (error) {
      console.error("Erro ao obter todas as tarefas:", error);
      return [];
    }
  } 

  public async getById(id: string): Promise<Task | null> {
    try {
      if (!this._realm) {
        this._realm = await this.getRealm();
      }
      const task = this._tasks.find((t) => t.id === id);
      return task || null;
    } catch (error) {
      console.error("Erro ao obter tarefa pelo ID:", error);
      return null;
    }
  }
}

const taskStorage = new TaskStorage();
export default taskStorage;