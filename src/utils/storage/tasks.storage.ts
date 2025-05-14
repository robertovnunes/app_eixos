import BaseService from './base.storage';
import Realm from 'realm';
import Task, { SubTask } from 'interfaces/Task';

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
      await this._loadTasks();
    } catch (error) {
      console.error('Erro ao inicializar TaskStorage:', error);
    }
  }

  private async _loadTasks(): Promise<void> {
    try {
      if (!this._realm) {
        this._realm = await this.getRealm();
      }
      const tasks = Array.from(this._realm.objects<Task>('Task'));
      this._tasks = tasks.map((task) => ({
        id: task.id,
        titulo: task.titulo,
        descricao: task.descricao,
        horario: task.horario,
        weekday: task.weekday,
        data: task.data,
        reminderTime: task.reminderTime,
        subtasks: Array.from(task.subtasks || []),
        concluido: task.concluido,
        importante: task.importante,
        urgente: task.urgente,
        prioridade: task.prioridade,
      }));
      
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      this._tasks = [];
    }
  }

  public async getAll(): Promise<Task[]> {
    try {
      return this._tasks;
    } catch (error) {
      console.error('Erro ao obter todas as tarefas:', error);
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
      console.error('Erro ao obter tarefa pelo ID:', error);
      return null;
    }
  }

  public async add(task: Task): Promise<void> {
    try {
      if (!this._realm) {
        this._realm = await this.getRealm();
      }
      this._realm.write(() => {
        this._realm?.create('Task', {
          id: task.id,
          titulo: task.titulo,
          descricao: task.descricao,
          horario: task.horario,
          weekday: task.weekday,
          data: task.data,
          reminderTime: task.reminderTime,
          subtasks: task.subtasks,
          concluido: task.concluido,
          importante: task.importante,
          urgente: task.urgente,
          prioridade: task.prioridade,
        });
      });
      await this._loadTasks();
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  }

  public async update(task: Task): Promise<void> {
    try {
      if (!this._realm) {
        this._realm = await this.getRealm();
      }
      this._realm.write(() => {
        const existingTask = this._realm?.objectForPrimaryKey<Task>('Task', task.id);
        if (existingTask) {
          existingTask.titulo = task.titulo;
          existingTask.descricao = task.descricao;
          existingTask.horario = task.horario;
          existingTask.weekday = task.weekday;
          existingTask.data = task.data;
          existingTask.reminderTime = task.reminderTime;
          existingTask.subtasks = task.subtasks;
          existingTask.concluido = task.concluido;
          existingTask.importante = task.importante;
          existingTask.urgente = task.urgente;
          existingTask.prioridade = task.prioridade;
        }
      });
      await this._loadTasks();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  }

  public async remove(id: string): Promise<void> {
    try {
      if (!this._realm) {
        this._realm = await this.getRealm();
      }
      this._realm.write(() => {
        const taskToDelete = this._realm?.objectForPrimaryKey<Task>('Task', id);
        if (taskToDelete) {
          this._realm?.delete(taskToDelete);
        }
      });
      await this._loadTasks();
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
    }
  }

}

const taskStorage = new TaskStorage();
export default taskStorage;
