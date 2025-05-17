// App.tsx
import { createDrawerNavigator } from '@react-navigation/drawer'; // Importe createDrawerNavigator
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { Theme } from '@react-navigation/native';
import Modal from 'react-native-modal';

import CustomDrawerContent from './src/UI/components/CustomDrawer';
import Rotinas from './src/UI/screens/tasks/rotinas/index';
import ListScreen from './src/UI/screens/TasksList';
import { ThemeProvider, useTheme } from './src/utils/contexts/themeContext';
import Focus from './src/UI/screens/Focus';
import SettingsScreen from './src/UI/screens/Settings';
import { FloatingButton } from './src/UI/components';
import NewTask from './src/UI/screens/tasks/views/NewTask';


// Criação dos navegadores
const Drawer = createDrawerNavigator();

let theme: Theme;

// Componente principal App
const App: React.FC = () => {
  theme = useTheme().theme; // Obtém o tema e a função de alternar tema do contexto

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
const EixosScreen = () => {
  const navigation = useNavigation<any>(); // Obtém o objeto de navegação
  const [addContext, setAddContext] = React.useState(false); // Estado para controlar o contexto de adição
  const [showNewTask, setShowNewTask] = React.useState(false); // Estado para controlar a exibição do modal de nova tarefa

  const addContextMenu = () => {
    // Lógica para adicionar o menu de contexto
    const options = [
      {
        'Adicionar tarefa': () => {
          setShowNewTask(true); // Exibe o modal de nova tarefa
        },
      },
      { 'Adicionar nota': () => console.log('Adicionar nota') },
      { 'Area do caos': () => console.log('Area do caos') },
    ];

    return (
      <>
        <Modal
          isVisible={addContext}
          onBackdropPress={() => setAddContext(false)} // Fecha ao clicar fora
          onSwipeComplete={() => setAddContext(false)}
          swipeDirection="down"
          style={{ margin: 0, justifyContent: 'flex-end' }}
        >
          <View
            style={[
              styles.contextMenu,
              { backgroundColor: theme.colors.background },
            ]}
          >
            {options.map((option, index) => (
              <TouchableOpacity
                style={{ padding: 10 }} // Estilo do botão
                key={index}
                onPress={() => {
                  option[Object.keys(option)[index]]();
                  setAddContext(false); // Fecha o menu de contexto após a seleção
                }}
              >
                <Text style={{ fontSize: 32, color: theme.colors.text }}>
                  {Object.keys(option)[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {/* Botão para navegar para a tela Rotinas */}
      <View>
        <TouchableOpacity
          style={{
            backgroundColor: 'blue',
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
          }}
          onPress={() => navigation.navigate('Rotinas')}
        >
          <Text>Rotinas</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.FAB}>
        <FloatingButton
          onClick={() => setAddContext((prev) => !prev)} // Alterna o estado de adição
        />
      </View>
      {addContext && addContextMenu()}
      <Modal
        isVisible={showNewTask}
        onBackdropPress={() => setShowNewTask(false)} // Fecha ao clicar fora
        onSwipeComplete={() => setShowNewTask(false)}
        swipeDirection="down"
        style={{ margin: 0, justifyContent: 'flex-end' }}
      >
        <NewTask type={'Tarefa'} />
      </Modal>
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
    padding: 10,
  },
  FAB: {
    bottom: 16,
    right: 16,
    position: 'absolute',
  },
  contextMenu: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
