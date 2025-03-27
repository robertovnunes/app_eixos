import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Timer } from 'interfaces/timer';
import { RoutineTask } from 'interfaces/routineTask';
import { Task } from 'interfaces/task';

const STORAGE_KEY = 'eixos';

interface StorageContextType {
  storageData: DefaultData;
  updateStorage: <T>(key: string, newData: T[]) => Promise<void>;
}

interface DefaultData {
  timers: Timer[];
  routineTasks: RoutineTask[];
  tasks: Task[];
}

const defaultData = {
  timers: [] as Timer[],
  routineTasks: [] as RoutineTask[],
  tasks: [] as Task[],
};

const StorageContext = createContext<StorageContextType>(undefined as any);

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!children) return null;
  const [storageData, setStorageData] = useState(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeStorage();
  }, []);

  const initializeStorage = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setStorageData(JSON.parse(data));
      } else {
        await createEmptyStorage();
      }
    } catch (error) {
      console.error('Failed to initialize storage', error);
    } finally {
      setLoading(false);
    }
  };

  async function updateStorage<T> (key: string, newData: T[]) {
    try {
      const updatedData = { ...storageData, [key]: newData };
      setStorageData(updatedData);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Failed to update storage', error);
    }
  };

  const createEmptyStorage = async () => {
    try {
      const defaultStructure = JSON.stringify(defaultData);
      await AsyncStorage.setItem(STORAGE_KEY, defaultStructure);
      setStorageData(defaultData);
      console.log('Default storage initialized');
    } catch (error) {
      console.error('Error setting default storage', error);
    }
  };

    return (
      <StorageContext.Provider value={{ storageData, updateStorage }}>
        {children}
      </StorageContext.Provider>
    );
};

export const useStorage = () => useContext(StorageContext);
