import { useState, useEffect } from 'react';
import routineStorage from '../../../utils/storage/routine.storage';
import Rotina from 'interfaces/Rotina';

export function useRoutineTasks() {
  const [routine, setRoutine] = useState<Rotina[]>([]);

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

  return { routine, setRoutine };
}
