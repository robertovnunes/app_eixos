import { RoutineTask } from 'interfaces/routineTask';
import shortid from 'shortid';
import storageManager from '../services/storageService';

class RoutineStorage {
  private _routineTasks: RoutineTask[][] = [];

  constructor() {
    this._loadTasks().then((data) => {
      this._routineTasks = data;
      console.log('Tarefas carregadas:', this._routineTasks);
    });
  }

  private _saveTasks = async () => {
    try {
      await storageManager.updateStorage('routineTasks', this._routineTasks);
      console.log(this._routineTasks);
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
    }
  };

  private _loadTasks = async (): Promise<
    RoutineTask[][]
  > => {
    try {
      const data = storageManager.getStorageData().routineTasks;
      return data ? data : [];
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      return [];
    }
  };

  getTasks = async (): Promise<RoutineTask[][]> => {
    return this._routineTasks;
  }

  loadTask = async (id: string, dia: number): Promise<RoutineTask | null> => {
    try {
      const tasks = await this._loadTasks();
      const dayTasks = tasks[dia];
      const dayTask = dayTasks.find((task) => task.id === id);
      return dayTask || null;
    } catch (error) {
      console.error('Erro ao carregar tarefa:', error);
      return null;
    }
  };

  saveTask = async (task: RoutineTask, dia: number) => {
    try {
      task.id = shortid.generate();
      this._routineTasks[dia].push(task);
      console.log('Tarefa salva:', task);
      await this._saveTasks();
      return task;
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      return null;
    }
  };

  deleteTask = async (id: string, dia: number) => {
    try {
      this._routineTasks[dia] = this._routineTasks[dia].filter(
        (task) => task.id !== id,
      );
      await this._saveTasks();
      return;
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  updateTask = async (task: RoutineTask, dia: number) => {
    try {
      this._routineTasks[dia] = this._routineTasks[dia].map((routineTask) => {
        if (routineTask.id === task.id) {
          return { ...routineTask, ...task };
        }
        return routineTask;
      });

      if (this._routineTasks) {
        await this._saveTasks();
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };
}

const routineStorage = new RoutineStorage();

export default routineStorage;
