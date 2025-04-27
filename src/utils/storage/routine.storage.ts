import RoutineTask from 'interfaces/routineTask';
import RoutineTaskSchema from '../schemas/RoutineTaskSchema';
import storageManager from '../services/storageService';
import Realm from 'realm';

interface RoutineDay {
  dayOfWeek: number;
  tasks: RoutineTask[];
}


class RoutineStorage {
  private _routineTasks: RoutineDay[] = [];
  private _realm = storageManager.getRealmInstance();

  constructor() {
    this._loadTasks().then((data) => {
      this._routineTasks = data;
      console.log('Tarefas carregadas:', this._routineTasks);
    });
  }

  private _loadTasks = async (): Promise<RoutineDay[]> => {
    try {
      const data = storageManager.getStorageData('routineTasks');
      return data ? data : [];
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      return [];
    }
  };

  getTasks = async (): Promise<RoutineDay[]> => {
    return this._routineTasks;
  }

  getTask = async (id: string, dia: number): Promise<RoutineTask | null> => {
    try {
      const dayTasks = this._routineTasks.find(day => day.dayOfWeek === dia);
      const task = dayTasks?.tasks.find((task) => task.id === id);
      return task ? task : null;
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      return null;
    }
  };

  getTasksByDay = async (dia: number): Promise<RoutineTask[]> => {
    try {
      const day = this._realm.objectForPrimaryKey<RoutineDay>('RoutineDay', dia);
      return day ? day.tasks.map(task => ({ ...task })) : [];
    } catch (error) {
      console.error('Erro ao buscar tarefas do dia:', error);
      return [];
    }
  }

  saveTask = async (task: RoutineTask, dia: number) => {
    try {
      this._realm.write(() => {
        let day = this._realm.objectForPrimaryKey<RoutineDay>('RoutineDay', dia);
        if (!day) {
          day = this._realm.create<RoutineDay>('RoutineDay', { dayOfWeek: dia, tasks: [] }, Realm.UpdateMode.Never);
        }
        day.tasks.push(task as unknown as RoutineTask);
      });
      const dayTasks = this._routineTasks.find(d => d.dayOfWeek === dia);
      if (dayTasks) {
        dayTasks.tasks.push(task);
      } else {
        this._routineTasks.push({ dayOfWeek: dia, tasks: [task] });
      }
      return task;
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      return null;
    }
  };

  deleteTask = async (id: string, dia: number) => {
    try {
      this._realm.write(() => {
        const day = this._realm.objectForPrimaryKey<RoutineDay>('RoutineDay', dia);
        if (day) {
          const index = day.tasks.findIndex(task => task.id === id);
          if (index !== -1) {
            day.tasks.splice(index, 1);
          }
        }
      });
      const dayTasks = this._routineTasks.find(d => d.dayOfWeek === dia);
      if (dayTasks) {
        dayTasks.tasks = dayTasks.tasks.filter(task => task.id !== id);
      }
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  updateTask = async (updatedTask: RoutineTask, dia: number) => {
    try {
      this._realm.write(() => {
        const day = this._realm.objectForPrimaryKey<RoutineDay>('RoutineDay', dia);
        if (day) {
          const task = day.tasks.find(task => task.id === updatedTask.id);
          if (task) {
            Object.assign(task, updatedTask);
          }
        }
      });
      const dayTasks = this._routineTasks.find(d => d.dayOfWeek === dia);
      if (dayTasks) {
        const index = dayTasks.tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
          dayTasks.tasks[index] = updatedTask;
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };
}

const routineStorage = new RoutineStorage();

export default routineStorage;
