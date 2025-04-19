import React from "react";
import { Button, View } from "react-native";
import { Alert } from "react-native";
import notificationService from "../../utils/services/NotificationService";
import { TextInputAlertGlobal } from "../components/TextInputAlert";
import Toast from "react-native-toast-message";

const SettingsScreen: React.FC = () => {
    return (
        <View>
            <Button title="Cancelar todas as notificações" onPress={() => {
                Alert.alert("Cancelar notificações", "Tem certeza que deseja cancelar todas as notificações?", [
                    {
                        text: "Cancelar",
                        style: "cancel",
                    },
                    {
                        text: "OK",
                        onPress: () => {
                            notificationService.cancelAllScheduledNotifications();
                        },
                    },
                ]);
            }
            } />
            <TextInputAlertGlobal />
            <Toast />
        </View>
    );
}

export default SettingsScreen;