import { useState, useEffect } from 'react';
import routineStorage from '../../../utils/storage/routine.storage';
import Rotina from 'interfaces/Rotina';
import Task from 'interfaces/Task';

export function useRoutineTasks() {
  const [routine, setRoutine] = useState<Rotina[]>([]);
  // Função para carregar as tarefas do armazenamento
  const [tasks, setTasks] = useState<Task[]>([]);

  async function fetchTasks() {
    try {
      const tasks = await routineStorage.getAll();
      tasks ? setRoutine(tasks) : setRoutine([]);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);
  return { routine, setRoutine, tasks, setTasks };
}
