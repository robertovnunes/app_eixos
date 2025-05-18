import { useState, useEffect } from 'react';
import routineStorage from '../../../../utils/storage/routine.storage';
import taskStorage from '../../../../utils/storage/tasks.storage';

import Rotina from 'interfaces/Rotina';
import Task from 'interfaces/Task';

export function useRoutineTasks() {
  const [routine, setRoutine] = useState<Rotina[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [routineTasks, setRoutineTasks] = useState<Task[]>([]);

  async function fetchTasks() {
    try {
      const tasks = await taskStorage.getAll();
      tasks ? setTasks(tasks) : setTasks([]);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  }
  async function fetchRoutine() {
    try {
      const routine = await routineStorage.getAll();
      routine ? setRoutine(routine) : setRoutine([]);
    } catch (error) {
      console.error('Erro ao carregar rotinas:', error);
    }
  }

  async function fetchRoutineTasks() {
    try {
      const tasks = await taskStorage.getAll();
      const routineTasks = tasks.filter((task) => task.isRoutine);
      setRoutineTasks(routineTasks);
    } catch (error) {
      console.error('Erro ao carregar tarefas de rotina:', error);
    }
  }

  useEffect(() => {
    fetchTasks();
    fetchRoutine();
    fetchRoutineTasks();
  }, []);
  return { routine, setRoutine, tasks, setTasks, routineTasks, setRoutineTasks };
}
