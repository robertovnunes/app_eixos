// App.tsx
import { createDrawerNavigator } from '@react-navigation/drawer'; // Importe createDrawerNavigator
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import CustomDrawerContent from './src/UI/components/CustomDrawer';
import Rotinas from './src/UI/screens/Rotinas';
import ListScreen from './src/UI/screens/RoutineTasks/TasksList';
import { ThemeProvider, useTheme } from './src/utils/contexts/themeContext';
import Focus from './src/UI/screens/Focus';
import { NotificationProvider } from './src/utils/contexts/NotificationContext';

// Criação dos navegadores
const Drawer = createDrawerNavigator();

// Componente principal App
const App: React.FC = () => {
  const { theme } = useTheme(); // Obtém o tema e a função de alternar tema do contexto

  return (
    <NavigationContainer theme={theme}>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        {/* Definição das telas do Drawer */}
        <Drawer.Screen name="Inicio" component={EixosScreen} />
        <Drawer.Screen name="Rotinas" component={Rotinas} />
        <Drawer.Screen name="Tarefas" component={ListScreen} />
        <Drawer.Screen name="Foco" component={Focus} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

// Componente da tela Eixos
const EixosScreen: React.FC = () => {
  const navigation = useNavigation<any>(); // Obtém o objeto de navegação

  return (
    <View style={styles.container}>
      {/* Botão para navegar para a tela Rotinas */}
    </View>
  );
};

// Componente de nível superior que envolve o App com o ThemeProvider
export default () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </ThemeProvider>
  );
};

// Estilos do componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
});
