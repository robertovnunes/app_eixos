import { RoutineTask } from 'interfaces/routineTask';
import shortid from 'shortid';
import storageManager from '../services/storageService';
import { useReload } from '../contexts/reloadContext';

class RoutineStorage {
  private routineTasks: { dia: string; routineTasks: RoutineTask[] }[] = [];

  constructor() {
    this.#init();
  }

  #init = async () => {
    try {
        const data = await this.loadTasks();
        this.routineTasks = data;
    } catch (error) {
        console.error('Erro ao inicializar o armazenamento:', error);
        }
    }

  saveTasks = async (dia: string, routineTasks: RoutineTask[]) => {
    try {
      const tasks = this.routineTasks.map((dayTask) => {
        if (dayTask.dia === dia) {
          return { ...dayTask, routineTasks };
        }
        return dayTask;
      });
      this.routineTasks = tasks;
      await storageManager.updateStorage('routineTasks', tasks);
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
    }
  };

  loadTasks = async (): Promise<
    { dia: string; routineTasks: RoutineTask[] }[]
  > => {
    try {
      const data = storageManager.getStorageData().routineTasks;
      return data ? data : [];
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      return [];
    }
  };

  loadTask = async (id: string, dia: string): Promise<RoutineTask | null> => {
    try {
      const tasks = await this.loadTasks();
      const dayTasks =
        tasks.find((dayTask) => dayTask.dia === dia)?.routineTasks || [];

      const dayTask = dayTasks.find((task) => task.id === id);
      return dayTask || null;
    } catch (error) {
      console.error('Erro ao carregar tarefa:', error);
      return null;
    }
  };

  saveTask = async (task: RoutineTask, dia: string) => {
    try {
      const { triggerRoutinesReload } = useReload();

      task.id = shortid.generate();
      const dayTasks = this.routineTasks.find((dayTask) => dayTask.dia === dia);
      if (dayTasks) {
        dayTasks.routineTasks.push(task);
        await this.saveTasks(dia, dayTasks.routineTasks);
        triggerRoutinesReload();
        return task;
      }

      return null;
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    }
  };

  deleteTask = async (id: string) => {
    try {
      const { triggerRoutinesReload } = useReload();

      this.routineTasks.forEach((dayTask) => {
        const index = dayTask.routineTasks.findIndex((task) => task.id === id);
        if (index !== -1) {
          dayTask.routineTasks.splice(index, 1);
        }
      });
      await storageManager.updateStorage('routineTasks', this.routineTasks);
      triggerRoutinesReload();
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  updateTask = async (task: RoutineTask) => {
    try {
      const { triggerRoutinesReload } = useReload();

      this.routineTasks.forEach((dayTask) => {
        const index = dayTask.routineTasks.findIndex((t) => t.id === task.id);
        if (index !== -1) {
          dayTask.routineTasks[index] = task;
        }
      });

      if (this.routineTasks) {
        await storageManager.updateStorage('routineTasks', this.routineTasks);
        triggerRoutinesReload();
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };
}

const routineStorage = new RoutineStorage();

export default routineStorage;
