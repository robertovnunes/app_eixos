import AsyncStorage from '@react-native-async-storage/async-storage';
import { RoutineTask } from 'interfaces/routineTask';
import shortid from 'shortid';
import StorageManager from './storage';


const storageManager = new StorageManager();


export const saveTasks = async (tasks: RoutineTask[]) => {
    
    try {
        await storageManager.updateStorage('routineTasks', tasks);
    } catch (error) {
        console.error('Erro ao salvar tarefas:', error);
    }
};

export const loadTasks = async (): Promise<RoutineTask[]> => {
    try {
        const data = storageManager.getStorageData().routineTasks;
        return data ? data : [];
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        return [];
    }
};

export const saveTask = async (task: RoutineTask) => {
    try {
        task.id = shortid.generate();
        const tasks = await loadTasks();
        tasks.push(task);
        await saveTasks(tasks);
    } catch (error) {
        console.error('Erro ao salvar tarefa:', error);
    }
};

export const deleteTask = async (id: string) => {
    try {
        const tasks = await loadTasks();
        const newTasks = tasks.filter((task) => task.id !== id);
        await saveTasks(newTasks);
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
    }
};

export const updateTask = async (task: RoutineTask) => {
    try {
        const tasks = await loadTasks();
        const index = tasks.findIndex((t) => t.id === task.id);
        if (index !== -1) {
            tasks[index] = task;
            await saveTasks(tasks);
        }
    } catch (error) {
        console.error('Erro ao atualizar tarefa:', error);
    }
};
