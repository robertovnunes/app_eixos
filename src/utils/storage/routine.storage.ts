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

  public async getDay(dia: number): Promise<Rotina | null> {
    try {
      if (!this._realm) {
        this._realm = await this.getRealm();
      }
      const rotina = this._rotinas.find((r) => r.dia === dia);
      return rotina || null;
    } catch (error) {
      console.error('Erro ao obter rotina do dia:', error);
      return null;
    }
  }

  public async insertTask(dia: number, id: string): Promise<string> {
    try {
      if (!this._realm) {
        this._realm = await this.getRealm();
      }
      this._realm.write(() => {
        const rotina = this._rotinas.find((r) => r.dia === dia);
        if (rotina) {
          rotina.tarefas.push(id);
        } else {
          const newRotina: Rotina = {
            dia,
            tarefas: [id],
          };
          this._createRotina(newRotina);
        }
      });
      await this.getAll();
      return id;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw new Error('Erro ao criar tarefa');
    }
  }

  public async removeTask(dia: number, tarefa: string): Promise<void> {
    try{
      if (!this._realm) {
        this._realm = await this.getRealm();
      }
      const rotinas = this._realm.objects<Rotina>('Rotina');
      this._realm.write(() => {
        const rotina = rotinas.find((r) => r.dia === dia);
        if (rotina) {
          const index = rotina.tarefas.indexOf(tarefa);
          if (index > -1) {
            rotina.tarefas.splice(index, 1);
          }
        }
      });
      await this.getAll();
    } catch (error) {
      console.error('Erro ao remover tarefa:', error);
    }
  }
  
}

const routineStorage = new RoutineStorage();

export default routineStorage;