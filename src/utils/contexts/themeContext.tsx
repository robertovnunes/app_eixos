// ThemeContext.tsx
import React, { createContext, useState, useContext } from 'react';
import { Appearance } from 'react-native';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

interface ThemeContextType {
  isDarkMode: boolean;  
  toggleDarkMode: () => void;
  theme: typeof DefaultTheme | typeof DarkTheme;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  theme: DefaultTheme,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(
    Appearance.getColorScheme() === 'dark',
  );

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = isDarkMode ? DarkTheme : DefaultTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
