// App.tsx
import { createDrawerNavigator } from '@react-navigation/drawer'; // Importe createDrawerNavigator
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';

import CustomDrawerContent from './src/UI/components/CustomDrawer';
import Rotinas from './src/UI/screens/rotinas/index';
import ListScreen from './src/UI/screens/TasksList';
import { ThemeProvider, useTheme } from './src/utils/contexts/themeContext';
import Focus from './src/UI/screens/Focus';
import SettingsScreen from './src/UI/screens/Settings';


// Criação dos navegadores
const Drawer = createDrawerNavigator();

// Componente principal App
const App: React.FC = () => {
  const { theme } = useTheme(); // Obtém o tema e a função de alternar tema do contexto

  return (
    <NavigationContainer theme={theme}>
      <StatusBar style="auto" backgroundColor={theme.colors.background} />
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        {/* Definição das telas do Drawer */}
        <Drawer.Screen name="Inicio" component={EixosScreen} />
        <Drawer.Screen name="Rotinas" component={Rotinas} />
        <Drawer.Screen name="Tarefas" component={ListScreen} />
        <Drawer.Screen name="Foco" component={Focus} />
        <Drawer.Screen
          options={
            { drawerItemStyle: { display: 'none' } } // Oculta o item de menu
          }
          name="Configurações"
          component={SettingsScreen}
        />
      </Drawer.Navigator>
      {/* Adicione o alerta global */}
      <Toast />
    </NavigationContainer>
  );
};

// Componente da tela Eixos
const EixosScreen: React.FC = () => {
  const navigation = useNavigation<any>(); // Obtém o objeto de navegação

  return (
    <View style={styles.container}>
      {/* Botão para navegar para a tela Rotinas */}
      <View>
        <TouchableOpacity style={{
          backgroundColor: 'blue',
          padding: 10,
          borderRadius: 5,
          marginBottom: 10
        }} onPress={() => navigation.navigate('Rotinas')}>
          <Text>Rotinas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Componente de nível superior que envolve o App com o ThemeProvider
export default () => {
  return (
    <ThemeProvider>
      <App />
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
