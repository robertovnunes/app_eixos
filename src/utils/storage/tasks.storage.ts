import { Task } from 'interfaces/Task';
import shortid from 'shortid';
import storageManager from '../services/storageService';


export const saveTasks = async (tasks: Task[]) => {
  try {
    await storageManager.updateStorage('tasks', tasks);
  } catch (error) {
    console.error('Erro ao salvar tarefas:', error);
  }
};

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const tasks = storageManager.getStorageData().tasks;
    return tasks || [];
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
    return [];
  }
};

export const loadTask = async (id: string): Promise<Task | null> => {
  try {
    const tasks = await loadTasks();
    const task = tasks.find((task) => task.id === id);
    return task || null;
  } catch (error) {
    console.error('Erro ao carregar tarefa:', error);
    return null;
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
