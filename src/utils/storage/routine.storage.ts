import RoutineTaskDay, { RoutineTaskItem } from 'interfaces/routineTask';
import BaseService from './base.storage';
import Realm from 'realm';



class RoutineStorage extends BaseService {
  private _routineTasks: RoutineTaskDay[] = [];
  private _realm: Realm = undefined as unknown as Realm;

  super() {
    this.getRealm().then((realm) => {
      this._realm = realm;
    });
    this._loadTasks().then((data) => {
      this._routineTasks = data;
      console.log('Tarefas carregadas:', this._routineTasks);
    });
  }

  private _loadTasks = async (): Promise<RoutineTaskDay[]> => {
    try {
      const data: RoutineTaskDay[] = Array.from(
        this._realm.objects<RoutineTaskDay>('RoutineDay'),
      ).map((day) => {
        return {
          dayOfWeek: day.dayOfWeek,
          tasks: day.tasks.map((task) => {
            return {
              id: task.id,
              titulo: task.titulo,
              descricao: task.descricao,
              horario: task.horario,
              reminderTime: task.reminderTime,
              notificationIds: task.notificationIds,
            };
          }),
        };
      });
      return data ? data : ([] as RoutineTaskDay[]);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      return [];
    }
  };

  getTasks = async (): Promise<RoutineTaskDay[]> => {
    return this._routineTasks;
  };

  getTask = async (
    id: string,
    dia: number,
  ): Promise<RoutineTaskItem | null> => {
    try {
      const dayTasks = this._routineTasks.find((day) => day.dayOfWeek === dia);
      const task = dayTasks?.tasks.find((task) => task.id === id);
      return task ? task : null;
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      return null;
    }
  };

  getTasksByDay = async (dia: number): Promise<RoutineTaskItem[]> => {
    try {
      const day = this._realm.objectForPrimaryKey<RoutineTaskDay>(
        'RoutineDay',
        dia,
      );
      return day ? day.tasks.map((task) => ({ ...task })) : [];
    } catch (error) {
      console.error('Erro ao buscar tarefas do dia:', error);
      return [];
    }
  };

  saveTask = async (task: RoutineTaskItem, dia: number): Promise<RoutineTaskItem | null> => {
    try {
      this._realm.write(() => {
        let day = this._realm.objectForPrimaryKey<RoutineTaskDay>(
          'RoutineDay',
          dia,
        );
        if (!day) {
          day = this._realm.create<RoutineTaskDay>(
            'RoutineDay',
            { dayOfWeek: dia, tasks: [task] },
            Realm.UpdateMode.Modified,
          );
        } else {
          day.tasks.push(task as unknown as RoutineTaskItem); // Adiciona a tarefa ao dia existente
        //salvar tarefa no banco de dados no dia correspondente
        }
        day.tasks.push(task as unknown as RoutineTaskItem);
      });
      const dayTasks = this._routineTasks.find((d) => d.dayOfWeek === dia);
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
        const day = this._realm.objectForPrimaryKey<RoutineTaskDay>(
          'RoutineDay',
          dia,
        );
        if (day) {
          const index = day.tasks.findIndex((task) => task.id === id);
          if (index !== -1) {
            day.tasks.splice(index, 1);
          }
        }
      });
      const dayTasks = this._routineTasks.find((d) => d.dayOfWeek === dia);
      if (dayTasks) {
        dayTasks.tasks = dayTasks.tasks.filter((task) => task.id !== id);
      }
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  updateTask = async (updatedTask: Partial<RoutineTaskItem>, dia: number) => {
    try {
      this._realm.write(() => {
        const day = this._realm.objectForPrimaryKey<RoutineTaskDay>(
          'RoutineDay',
          dia,
        );
        if (day) {
          const task = day.tasks.find((task) => task.id === updatedTask.id);
          if (task) {
            Object.assign(task, updatedTask);
          }
        }
      });
      const dayTasks = this._routineTasks.find((d) => d.dayOfWeek === dia);
      if (dayTasks) {
        const index = dayTasks.tasks.findIndex(
          (task) => task.id === updatedTask.id,
        );
        if (index !== -1) {
          dayTasks.tasks[index] = { ...dayTasks.tasks[index], ...updatedTask };
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };
}

const routineStorage = new RoutineStorage();

export default routineStorage;
