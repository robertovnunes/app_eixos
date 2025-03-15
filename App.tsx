// App.tsx
import { createDrawerNavigator } from '@react-navigation/drawer'; // Importe createDrawerNavigator
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import * as Device from 'expo-device';
import * as Notification from 'expo-notifications';
import { Platform } from 'react-native';

import CustomDrawerContent from './src/UI/components/CustomDrawer';
import Rotinas from './src/UI/screens/Rotinas';
import ListScreen from './src/UI/screens/RoutineTasks/TasksList';
import { ThemeProvider, useTheme } from './src/utils/contexts/themeContext';
import Focus from './src/UI/screens/Focus';

// Criação dos navegadores
const Drawer = createDrawerNavigator();

// Função para registrar notificações
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notification.setNotificationChannelAsync('eixos-channel', {
      name: 'Eixos',
      importance: Notification.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notification.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notification.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Falha ao obter o token de push notification!');
      return;
    }
    token = (
      await Notification.getExpoPushTokenAsync({ projectId: 'YOUR_PROJECT_ID' })
    ).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

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

  useEffect(() => {
    registerForPushNotificationsAsync(); // Chama a função de registro

    // Configuração de manipuladores para notificações
    Notification.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    //listener de recebimento de notificação
    const subscription = Notification.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification Received:', notification);
      },
    );
    //listener de click na notificação
    const responseSubscription =
      Notification.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });
    //retira os listeners quando desmontar
    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);

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
