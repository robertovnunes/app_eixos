import React, { createContext, useContext, useState, ReactNode } from 'react';


const reloadContext = createContext({
  reload: {reloadRoutines: false, reloadTasks: false, reloadTimer: false},
  triggerRoutinesReload: () => {},
  triggerTasksReload: () => {},
  triggerTimerReload: () => {},
  resetReload: (listName: string) => {},
});

export const useReload = () => {
  return useContext(reloadContext);
};


export const ReloadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [reloadRoutines, setReloadRoutines] = useState(false);
  const [reloadTasks, setReloadTasks] = useState(false);
  const [reloadTimer, setReloadTimer] = useState(false);

  const triggerRoutinesReload = () => {
    setReloadRoutines(true);
  };
  const triggerTasksReload = () => {
    setReloadTasks(true);
  }
  const triggerTimerReload = () => {
    setReloadTimer(true);
  };
  const resetReload = (listName: string) => {
    switch (listName) {
      case 'routines':
        setReloadRoutines(false);
        break;
      case 'tasks':
        setReloadTasks(false);
        break;
      case 'timer':
        setReloadTimer(false);
        break;
      default:
        break;
    }
  };

  return (
    <reloadContext.Provider
      value={{
        reload: {reloadRoutines, reloadTasks, reloadTimer},
        triggerRoutinesReload,
        triggerTasksReload,
        triggerTimerReload,
        resetReload,
      }}
    >
      {children}
    </reloadContext.Provider>
  );
  
};