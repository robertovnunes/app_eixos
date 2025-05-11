import BaseService from './base.storage';
import Rotina from 'interfaces/Rotina';
import Realm from 'realm';

class RoutineStorage extends BaseService {
  private _realm: Realm | null = null;
  private _rotinas: Rotina[] = [];

  constructor() {
    super();
    this.initialize();
  }


  private async initialize(): Promise<void> {
    try {
      if (!this._realm) {
        this._realm = await this.getRealm();
      }
      await this.getAll();
    } catch (error) {
      console.error('Erro ao inicializar RoutineStorage:', error);
    }
  }

  public async getAll(): Promise<Rotina[] | void> {
    try {
      if (!this._realm) {
        this._realm = await this.getRealm();
      }
      this._rotinas = Array.from(this._realm.objects<Rotina>('Rotina'));
      return Array.from(this._rotinas);
    } catch (error) {
      console.error('Erro ao obter todas as rotinas:', error);
      return [];
    }
  }

  private async _createRotina(rotina: Rotina): Promise<void> {
    try {
      if (!this._realm) {
        this._realm = await this.getRealm();
      }
      this._realm.write(() => {
        this._realm?.create('Rotina', rotina);
      });
    } catch (error) {
      console.error('Erro ao criar rotina:', error);
    }
  }

  public async createTask(dia: number, tarefa: string): Promise<void> {
    try {
      if (!this._realm) {
        this._realm = await this.getRealm();
      }
      const rotinas = this._realm.objects<Rotina>('Rotina');
      this._realm.write(() => {
        const rotina = rotinas.find((r) => r.dia === dia);
        if (rotina) {
          rotina.tarefas.push(tarefa);
        } else {
          const newRotina: Rotina = {
            dia,
            tarefas: [tarefa],
          };
          this._createRotina(newRotina);
        }
      });
      await this.getAll();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  }
  
}

const routineStorage = new RoutineStorage();

export default routineStorage;