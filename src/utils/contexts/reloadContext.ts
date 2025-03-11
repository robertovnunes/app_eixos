import { createContext } from 'react';

export const ReloadContext = createContext({
  reload: false,
  triggerReload: () => {},
  resetReload: () => {},
});
