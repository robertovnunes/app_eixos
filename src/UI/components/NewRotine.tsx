import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { RoutineTask } from 'interfaces/routineTask';
import React, { useState, useEffect } from 'react';
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
import { saveTask } from '../../utils/storage/routine.storage';

interface NewRoutineProps {
  onAbort: () => void;
  onAdd: (newTask: RoutineTask) => void;
}

interface ReminderOption {
  value: number | null; // Em minutos
  label: string;
}

// Opções de tempo de lembrete.
const reminderOptions: ReminderOption[] = [
  { value: 60, label: '1h antes' },
  { value: 30, label: '30min antes' },
  { value: 25, label: '25min antes' },
  { value: 10, label: '10min antes' },
  { value: 5, label: '5min antes' },
  { value: null, label: 'Imediatamente' },
];

const NewRoutine: React.FC<NewRoutineProps> = ({ onAbort, onAdd }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [horario, setHorario] = useState<Date | null>(null);
  const [dias, setDias] = useState<string[]>([]);
  const [reminderTime, setReminderTime] = useState<number | null>(0); // Valor padrão: imediatamente


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
      horario: horario.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }), // Salva o horário formatado como string
      reminderTime, // Salva o tempo de lembrete aqui
    };

    setTitulo('');
    setDescricao('');
    setHorario(null);
    setDias([]);
    setReminderTime(0);
    saveTask(newTask);
    onAdd(newTask); // Chama a função onAdd com a nova tarefa
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
