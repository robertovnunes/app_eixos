import Rotina from "interfaces/Rotina";
import Realm from 'realm';


export default class RotinaSchema extends Realm.Object<Rotina> implements Rotina {
  id!: string;
  dia!: number;
  tarefas!: string[];

  static schema = {
    name: "Rotina",
    primaryKey: "id",
    properties: {
      id: "string",
      dia: "int",
      tarefas: "string[]",
    },
  };
}
