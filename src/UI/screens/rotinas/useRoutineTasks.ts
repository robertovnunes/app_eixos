import { useState, useEffect } from 'react';
import routineStorage from '../../../utils/storage/routine.storage';
import Task from 'interfaces/Task';

export function useRoutineTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  async function fetchTasks() {
    try {
      const tasks = await routineStorage.getTasks();
      setTasks(tasks);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, setTasks };
}
