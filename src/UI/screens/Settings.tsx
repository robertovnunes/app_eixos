import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Alert } from "react-native";
import notificationService from "../../utils/services/NotificationService";
import { TextInputAlertGlobal } from "../components/TextInputAlert";
import Toast from "react-native-toast-message";
import { useTheme } from "../../utils/contexts/themeContext";

const ClearNotificationButton = () => {

    const { theme } = useTheme(); // Obtém o tema e a função de alternar tema do contexto

    return (
      <TouchableOpacity
        style={{ padding: 10, margin: 10 }}
        onPress={() => {
          Alert.alert(
            'Cancelar notificações',
            'Tem certeza que deseja cancelar todas as notificações?',
            [
              {
                text: 'Cancelar',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {
                  notificationService.cancelAllScheduledNotifications();
                },
              },
            ],
          );
        }}
      >
        <Text
          style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text }}
        >
          Cancelar todas as notificações
        </Text>
      </TouchableOpacity>
    );    
};

const TimerDefinitionButton = () => {
    const { theme } = useTheme(); // Obtém o tema e a função de alternar tema do contexto

    return (
      <TouchableOpacity
        style={{ padding: 10, margin: 10 }}
        onPress={() => {
          Alert.alert(
            'Definir timer',
            'Tem certeza que deseja definir um timer?',
            [
              {
                text: 'Cancelar',
                style: 'cancel',
              },
              {
                text: 'OK',
                onPress: () => {
                  notificationService.scheduleNotification(5, "Configuração alterada", "Timer definido com sucesso!");
                },
              },
            ],
          );
        }}
      >
        <Text
          style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text }}
        >
          Definir timer
        </Text>
      </TouchableOpacity>
    );    
}

const SettingsScreen: React.FC = () => {


    return (
        <View>
            <ClearNotificationButton />
            <TextInputAlertGlobal />
            <TimerDefinitionButton />
            <Toast />
        </View>
    );
};

export default SettingsScreen;