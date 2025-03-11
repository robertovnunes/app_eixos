import AsyncStorage from '@react-native-async-storage/async-storage';
import {Task} from "interfaces/task";
import {Timer} from "interfaces/timer";
import { nanoid } from 'nanoid';


const STORAGE_KEY = '@routine_tracker';

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
        task.id = nanoid();
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

//Funções para salvar, carregar e deletar timers

export const loadTimers = async (): Promise<Timer[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem('@eixos_timers');
        return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (error) {
        console.error('Erro ao carregar timers:', error);
        return [];
    }
};

export const saveTimers = async (timers: Timer[]) => {
    try {
        const jsonValue = JSON.stringify(timers);
        await AsyncStorage.setItem('@eixos_timers', jsonValue);
    } catch (error) {
        console.error('Erro ao salvar timers:', error);
    }
};

export const saveTimer = async (timer: Timer) => {
    try {
        const timers = await loadTimers();
        timer.id = nanoid();
        timers.push(timer);
        await saveTimers(timers);
    } catch (error) {
        console.error('Erro ao salvar timer:', error);
    }
};

export const deleteTimer = async (id: string) => {
    try {
        const timers = await loadTimers();
        timers.filter((timer) => timer.id !== id);
        await saveTimers(timers);
    } catch (error) {
        console.error('Erro ao deletar timer:', error);
    }
};