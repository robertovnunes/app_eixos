import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { RoutineTask } from 'interfaces/routineTask';
import React, { useContext, useState, useEffect } from 'react';
import {
  Alert,
  Button,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { ReloadContext } from '../../utils/contexts/reloadContext';
import { saveTask, updateTask } from '../../utils/storage/routine.storage';

interface NewRoutineProps {
  onAbort: () => void;
  onAdd: () => void;
}

interface ReminderOption {
  value: number; // Em minutos
  label: string;
}

// Opções de tempo de lembrete.
const reminderOptions: ReminderOption[] = [
  { value: 60, label: '1h antes' },
  { value: 30, label: '30min antes' },
  { value: 25, label: '25min antes' },
  { value: 10, label: '10min antes' },
  { value: 5, label: '5min antes' },
  { value: 0, label: 'Imediatamente' },
];

const NewRoutine: React.FC<NewRoutineProps> = ({ onAbort, onAdd }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [horario, setHorario] = useState<Date | null>(null);
  const [dias, setDias] = useState<string[]>([]);
  const [reminderTime, setReminderTime] = useState<number>(0); // Valor padrão: imediatamente

  useEffect(() => {

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

  }, []);


  const openTimePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: horario || new Date(),
        mode: 'time',
        is24Hour: true,
        onChange: (_event, selectedTime) => {
          if (selectedTime) setHorario(selectedTime);
        },
      });
    }
  };

  const formatarHorario = (date: Date | null) => {
    if (date) {
      return date.toLocaleTimeString(['pt-BR'], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return new Date().toLocaleTimeString(['pt-BR'], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const scheduleTaskNotifications = async (task: RoutineTask) => {
    try {
      if (task.notificationIds && task.notificationIds.length > 0) {
        await Promise.all(
          task.notificationIds.map((id) =>
            Notifications.cancelScheduledNotificationAsync(id),
          ),
        );
      }

      const hour = task.horario.getHours();
      const minute = task.horario.getMinutes();
      const now = new Date();

      let daysUntilNextDayOfWeek =
        task.diasDaSemana
          .map((dia) =>
            ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].indexOf(dia),
          )
          .find((dayIndex) => (dayIndex - now.getDay() + 7) % 7 > 0) || 7;

      let triggerDate = new Date();
      triggerDate.setDate(now.getDate() + daysUntilNextDayOfWeek);
      triggerDate.setHours(hour, minute, 0, 0);

      if (triggerDate <= now) {
        triggerDate.setDate(triggerDate.getDate() + 7);
      }

      const trigger = {
        channelId: 'eixos-channel',
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        triggerDate,
        repeats: false,
      };

      const routineNotificationId =
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Rotina: ${task.titulo}`,
            body: task.descricao || 'Hora de realizar sua rotina!',
            data: { taskId: task.id },
          },
          trigger,
        });

      if (task.reminderTime && task.reminderTime > 0) {
        const reminderTriggerDate = new Date(triggerDate);
        reminderTriggerDate.setMinutes(
          triggerDate.getMinutes() - task.reminderTime,
        );

        if (reminderTriggerDate > now) {
          const reminderTrigger = {
            channelId: 'eixos-channel',
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            reminderTriggerDate,
            repeats: false,
          };

          const reminderNotificationId =
            await Notifications.scheduleNotificationAsync({
              content: {
                title: `Lembrete: ${task.titulo}`,
                body: task.descricao || 'Está quase na hora da sua rotina!',
                data: { taskId: task.id },
              },
              trigger: reminderTrigger,
            });

          task.notificationIds = [
            reminderNotificationId,
            routineNotificationId,
          ];
        }
      } else {
        task.notificationIds = [routineNotificationId];
      }

      await updateTask(task);
    } catch (error) {
      console.error('Erro ao agendar notificações:', error);
      Alert.alert('Erro', 'Não foi possível agendar as notificações.');
    }
  };

  const addTask = () => {
    if (!titulo || !horario || dias.length === 0) {
      Alert.alert(
        'Erro',
        'Preencha todos os campos e selecione pelo menos um dia!',
      );
      return;
    }

    const newTask: RoutineTask = {
      titulo,
      descricao,
      diasDaSemana: dias,
      horario: horario, // Salva o horário formatado como string
      reminderTime, // Salva o tempo de lembrete aqui
    };

    setTitulo('');
    setDescricao('');
    setHorario(null);
    setDias([]);
    setReminderTime(0);
    saveTask(newTask);
    scheduleTaskNotifications(newTask); // Agende a notificação aqui!
    onAdd();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        Nova Rotina
      </Text>
      <TextInput
        placeholder="Título da Tarefa"
        value={titulo}
        onChangeText={setTitulo}
        style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
      />

      <View
        style={{
          marginBottom: 10,
          flexDirection: 'row',
          justifyContent: 'flex-start',
        }}
      >
        {/* Seletor de Hora */}

        <TouchableOpacity
          onPress={openTimePicker}
          style={{
            backgroundColor: 'transparent',
            padding: 10,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 32,
              margin: 10,
              fontWeight: 'bold',
              marginBottom: 5,
            }}
          >
            {formatarHorario(horario)} ⚙
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginBottom: 10 }}>
        <Text>Selecione os dias da semana:</Text>
        <View style={{ flexDirection: 'row', marginStart: '5%' }}>
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
            <Button
              key={dia}
              title={dia}
              onPress={() => {
                setDias((prevDias) =>
                  prevDias.includes(dia)
                    ? prevDias.filter((d) => d !== dia)
                    : [...prevDias, dia],
                );
              }}
              color={dias.includes(dia) ? 'green' : 'gray'}
            />
          ))}
        </View>
      </View>
      {/* Seletor de Tempo de Lembrete */}
      <Text style={{ marginTop: 20, fontWeight: 'bold' }}>Lembrete</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {reminderOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.reminderButton,
              reminderTime === option.value && styles.selectedReminderButton,
            ]}
            onPress={() => setReminderTime(option.value)}
          >
            <Text
              style={[
                styles.reminderButtonText,
                reminderTime === option.value && { color: 'white' },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}
      >
        <TouchableOpacity
          onPress={onAbort}
          style={{ margin: 5, padding: 10, backgroundColor: 'red' }}
        >
          <Text style={{ color: 'white', fontSize: 18 }}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={addTask}
          style={{ margin: 5, padding: 10, backgroundColor: 'green' }}
        >
          <Text style={{ color: 'white', fontSize: 18 }}>Adicionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NewRoutine;

const styles = StyleSheet.create({
  reminderButton: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  selectedReminderButton: {
    backgroundColor: 'blue',
  },
  reminderButtonText: {
    textAlign: 'center',
  },
});
