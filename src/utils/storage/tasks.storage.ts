import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from 'interfaces/task';
import shortid from 'shortid';

const STORAGE_KEY = '@eixos_tasks';

export const saveTasks = async (tasks: Task[]) => {
  try {
    const jsonValue = JSON.stringify(tasks);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Erro ao salvar tarefas:', error);
  }
};

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
    return [];
  }
};

export const saveTask = async (task: Task) => {
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

export const updateTask = async (task: Task) => {
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
