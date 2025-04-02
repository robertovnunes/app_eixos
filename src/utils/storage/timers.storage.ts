import shortid from "shortid";
import { Timer } from "interfaces/timer";
import storageManager from "../services/storageService"
//Funções para salvar, carregar e deletar timers

export const loadTimers = async (): Promise<Timer[]> => {
  try {
    const timers = storageManager.getStorageData().timers;
    if (timers.length === 0 || !timers) {
      const defaultTimer = {
        id: 'default',
        name: 'Default Timer',
        focusDuration: { minutes: 25, seconds: 0 },
        shortBreakDuration: { minutes: 5, seconds: 0 },
        longBreakDuration: { minutes: 15, seconds: 0 },
        loops: 2
      };
      saveTimers([defaultTimer]);
    }
    return timers;
  } catch (error) {
    console.error('Erro ao carregar timers:', error);
    return [];
  }
};

export const saveTimers = async (timers: Timer[]) => {
  try {
    await storageManager.updateStorage('timers', timers);
  } catch (error) {
    console.error('Erro ao salvar timers:', error);
  }
};

export const saveTimer = async (
  timer: Partial<Timer>,
): Promise<Timer | undefined> => {
  try {
    const timers = await loadTimers();
    const id = shortid.generate();
    timer.id = id;
    timers.push(timer as Timer);
    await saveTimers(timers);
    return timer as Timer;
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
