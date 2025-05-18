import BaseService from "./base.storage";
import RoutineTask from "interfaces/RoutineTask";

class TaskRoutinesStorage extends BaseService {
    protected getSchemaName(): string {
        return "RoutineTask";
    }
}

export default new TaskRoutinesStorage();
