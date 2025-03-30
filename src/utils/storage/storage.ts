import AsyncStorage from '@react-native-async-storage/async-storage';
import { Timer } from 'interfaces/timer';
import { RoutineTask } from 'interfaces/routineTask';
import { Task } from 'interfaces/Task';

const STORAGE_KEY = 'eixos';

interface DefaultData {
  timers: Timer[];
  routineTasks: RoutineTask[];
  tasks: Task[];
}


class StorageManager {

  private defaultData: DefaultData = {
    timers: [],
    routineTasks: [],
    tasks: [],
  };
  
  private storageData: DefaultData = this.defaultData;
  
  constructor() {
    this.initializeStorage();
  }

  private async initializeStorage() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        this.storageData = JSON.parse(data);
      } else {
        await this.createEmptyStorage();
      }
    } catch (error) {
      console.error('Failed to initialize storage', error);
    }
  }

  private async createEmptyStorage() {
    try {
      const defaultStructure = JSON.stringify(this.defaultData);
      await AsyncStorage.setItem(STORAGE_KEY, defaultStructure);
      this.storageData = this.defaultData;
      console.log('Default storage initialized');
    } catch (error) {
      console.error('Error setting default storage', error);
    }
  }

  public getStorageData(): DefaultData {
    return this.storageData;
  }

  public async updateStorage<T>(key: string, newData: T[]): Promise<void> {
    try {
      const updatedData = { ...this.storageData, [key]: newData };
      this.storageData = updatedData;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Failed to update storage', error);
    }
  }
}

const storageManager = new StorageManager();
export default storageManager;