import RoutineTaskDay, { RoutineTaskItem } from 'interfaces/routineTask';
import BaseService from './base.storage';
import Realm from 'realm';

class RoutineStorage extends BaseService {
  private _routineTasks: RoutineTaskDay[] = [];
  private _realm: Realm | null = null;

  constructor() {
    super();
    this.initialize();
  }


  private async initialize(): Promise<void> {
    try {
      this._realm = await this.getRealm();
      const data = await this._loadTasks();
      this._routineTasks = data;
      console.log('Tarefas carregadas:', this._routineTasks);
    } catch (error) {
      console.error('Erro ao inicializar RoutineStorage:', error);
    }
  }

  private _loadTasks = async (): Promise<RoutineTaskDay[]> => {
    try {
      if (!this._realm) {
        this._realm = await this.getRealm();
      }

      const routineDays = this._realm.objects<RoutineTaskDay>('RoutineDay');
      const data: RoutineTaskDay[] = Array.from(routineDays).map((day) => {
        return {
          dayOfWeek: day.dayOfWeek,
          tasks: Array.from(day.tasks).map((task) => ({
            id: task.id,
            taskId: task.taskId,
            titulo: task.titulo,
            descricao: task.descricao,
            horario: task.horario,
            reminderTime: task.reminderTime,
            notificationIds: task.notificationIds,
          })),
        };
      });
      return data;
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      return [];
    }
  };

  getTasks = async (): Promise<RoutineTaskDay[]> => {
    // Recarrega as tarefas para garantir dados atualizados
    try {
      this._routineTasks = await this._loadTasks();
    } catch (error) {
      console.error('Erro ao recarregar tarefas:', error);
    }
    return this._routineTasks;
  };

  getTask = async (
    id: string,
    dia: number,
  ): Promise<RoutineTaskItem | null> => {
    try {
      // Recarrega para garantir dados atualizados
      this._routineTasks = await this._loadTasks();
      const dayTasks = this._routineTasks.find((day) => day.dayOfWeek === dia);
      const task = dayTasks?.tasks.find((task) => task.id === id);
      return task || null;
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      return null;
    }
  };

  getTasksByDay = async (dia: number): Promise<RoutineTaskItem[]> => {
    try {
      if (!this._realm) {
        this._realm = await this.getRealm();
      }
      
      const day = this._realm.objectForPrimaryKey<RoutineTaskDay>(
        'RoutineDay',
        dia,
      );
      
      if (day && day.tasks) {
        return Array.from(day.tasks).map(task => ({...task}));
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar tarefas do dia:', error);
      return [];
    }
  };

  saveTask = async (task: Partial<RoutineTaskItem>, dia: number): Promise<RoutineTaskItem | null> => {
    try {
      if (!this._realm) {
        this._realm = await this.getRealm();
      }
      
      this._realm.write(() => {
        let day = this._realm!.objectForPrimaryKey<RoutineTaskDay>(
          'RoutineDay',
          dia,
        );
        
        if (!day) {
          // Cria um novo dia com a tarefa
          day = this._realm!.create<RoutineTaskDay>(
            'RoutineDay',
            { dayOfWeek: dia, tasks: [task as RoutineTaskItem] },
            Realm.UpdateMode.Modified,
          );
        } else {
          // Adiciona a tarefa ao dia existente
          day.tasks.push(task as RoutineTaskItem);
        }
      });
      
      // Atualiza a cópia em memória
      await this._loadTasks();
      
      return task as RoutineTaskItem;
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      return null;
    }
  };

  deleteTask = async (id: string, dia: number): Promise<boolean> => {
    try {
      if (!this._realm) {
        this._realm = await this.getRealm();
      }
      
      this._realm.write(() => {
        const day = this._realm!.objectForPrimaryKey<RoutineTaskDay>(
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
      
      // Atualiza a cópia em memória
      await this._loadTasks();
      
      return true;
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      return false;
    }
  };

  updateTask = async (updatedTask: Partial<RoutineTaskItem>, dia: number): Promise<boolean> => {
    try {
      if (!this._realm) {
        this._realm = await this.getRealm();
      }
      
      this._realm.write(() => {
        const day = this._realm!.objectForPrimaryKey<RoutineTaskDay>(
          'RoutineDay',
          dia,
        );
        
        if (day) {
          const task = day.tasks.find((t) => t.id === updatedTask.id);
          if (task) {
            // Atualiza apenas os campos fornecidos
            Object.keys(updatedTask).forEach(key => {
              const typedKey = key as keyof RoutineTaskItem;
              if (updatedTask[typedKey] !== undefined) {
                (task as any)[typedKey] = updatedTask[typedKey];
              }
            });
          }
        }
      });
      
      // Atualiza a cópia em memória
      await this._loadTasks();
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return false;
    }
  };
}

const routineStorage = new RoutineStorage();

export default routineStorage;