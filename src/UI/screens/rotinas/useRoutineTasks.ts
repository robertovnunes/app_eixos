import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import routineStorage from '../../../utils/storage/routine.storage';
import RoutineTaskDay from 'interfaces/routineTask';

export function useRoutineTasks() {
  const [tasks, setTasks] = useState<RoutineTaskDay[]>([]);

  async function fetchTasks() {
    try {
      const tasks = await routineStorage.getTasks();
      setTasks(tasks);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (isActive) fetchTasks();
      return () => {
        isActive = false;
      };
    }, []),
  );

  return { tasks, setTasks };
}
