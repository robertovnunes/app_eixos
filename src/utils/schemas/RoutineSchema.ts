import Rotina from "interfaces/Rotina";
import Realm from 'realm';


export default class RotinaSchema extends Realm.Object<Rotina> implements Rotina {
  dia!: number;
  tarefas!: string[];

  static schema = {
    name: "Rotina",
    primaryKey: "dia",
    properties: {
      dia: "int",
      tarefas: "string[]",
    },
  };
}
