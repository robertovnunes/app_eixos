import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { RoutineTask } from 'interfaces/routineTask';
import React, { useContext, useState } from 'react';
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
import { ReloadContext } from '../../../utils/contexts/reloadContext';
import { saveTask } from '../../../utils/storage/routine.storage';

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
  const { triggerReload } = useContext(ReloadContext);
  const [reminderTime, setReminderTime] = useState<number>(0); // Valor padrão: imediatamente

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
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const scheduleRoutineNotification = async (task: RoutineTask) => {
    // Verifique se o horário é uma string no formato HH:MM
    if (
      typeof task.horario !== 'string' ||
      !/^([01]\d|2[0-3]):([0-5]\d)$/.test(task.horario)
    ) {
      console.error('Formato de horário inválido:', task.horario);
      return;
    }

    const [hour, minute] = task.horario.split(':').map(Number);

    task.diasDaSemana.forEach(async (dia) => {
      let dayOfWeek = 0;
      switch (dia) {
        case 'Dom':
          dayOfWeek = 0;
          break;
        case 'Seg':
          dayOfWeek = 1;
          break;
        case 'Ter':
          dayOfWeek = 2;
          break;
        case 'Qua':
          dayOfWeek = 3;
          break;
        case 'Qui':
          dayOfWeek = 4;
          break;
        case 'Sex':
          dayOfWeek = 5;
          break;
        case 'Sáb':
          dayOfWeek = 6;
          break;
      }
      const trigger = new Date();
      trigger.setHours(hour);
      trigger.setMinutes(minute);
      trigger.setSeconds(0);
      trigger.setMilliseconds(0);
      // Ajuste para o dia da semana correto
      trigger.setDate(
        trigger.getDate() + ((dayOfWeek - trigger.getDay() + 7) % 7),
      );

      // Schedule notification BEFORE the routine time
      const reminderTimeInMinutes = task.reminderTime ?? 0; // Se for null, usa 0 como padrão

      // Schedule notification BEFORE the routine time
      const beforeTrigger = new Date(
        trigger.getTime() - reminderTimeInMinutes * 60000,
      );
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Rotina: ${task.titulo} (Lembrete)`,
          body: task.descricao || 'Lembrete: Hora de realizar sua rotina!',
          data: { taskId: task.id },
        },
        trigger: {
          channelId: 'eixos-channel',
          hour: beforeTrigger.getHours(),
          minute: beforeTrigger.getMinutes(),
          repeats: true,
        },
      });
      console.log('Notificação de lembrete agendada para:', beforeTrigger);

      // Schedule notification AT the routine time
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Rotina: ${task.titulo}`,
          body: task.descricao || 'Hora de realizar sua rotina!',
          data: { taskId: task.id },
        },
        trigger: {
          channelId: 'eixos-channel',
          hour: trigger.getHours(),
          minute: trigger.getMinutes(),
          repeats: true,
        },
      });
      console.log('Notificação da rotina agendada para:', trigger);
    });
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
      id: Date.now().toString(),
      titulo,
      descricao,
      diasDaSemana: dias,
      horario: formatarHorario(horario), // Salva o horário formatado como string
      reminderTime, // Salva o tempo de lembrete aqui
    };

    setTitulo('');
    setDescricao('');
    setHorario(null);
    setDias([]);
    setReminderTime(0);
    saveTask(newTask);
    triggerReload();
    scheduleRoutineNotification(newTask); // Agende a notificação aqui!

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
