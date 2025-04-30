import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { RoutineTaskItem } from 'interfaces/routineTask';
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
import shortid from 'shortid';
interface NewRoutineProps {
  onAbort: () => void;
  onAdd: (newTask: Partial<RoutineTaskItem>, diasDaSemana: number[]) => void;
}

interface ReminderOption {
  value: number | null; // Em minutos
  label: string;
}

const generateId = () => {
  return shortid.generate(); // Gera um ID único para a tarefa
}


// Opções de tempo de lembrete.
let reminderOptions: ReminderOption[] = [
  { value: 60, label: '1h antes' },
  { value: 30, label: '30min antes' },
  { value: 25, label: '25min antes' },
  { value: 10, label: '10min antes' },
  { value: 5, label: '5min antes' },
];

const NewRoutine: React.FC<NewRoutineProps> = ({ onAbort, onAdd }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [horario, setHorario] = useState<Date | null>(null);
  const [dias, setDias] = useState<number[]>([]);
  const [reminderTime, setReminderTime] = useState<number[] | null>(null); // Valor padrão: imediatamente  

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

    const newTask: Partial<RoutineTaskItem> = {
      titulo,
      descricao,
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
    setReminderTime(null); // Reseta o tempo de lembrete
    onAdd(newTask, dias); // Chama a função onAdd com a nova tarefa
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
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia, index) => (
            <Button
              key={index}
              title={dia}
              onPress={() => {
                setDias((dias) => {
                  if (dias.includes(index)) {
                    return dias.filter((d) => d !== index); // Remove o dia se já estiver selecionado
                  }
                  return [...dias, index]; // Adiciona o dia se não estiver selecionado
                });
              }}
              color={dias.includes(index) ? 'green' : 'gray'}
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
              option.value !== null && reminderTime?.includes(option.value) && styles.selectedReminderButton,
            ]}
            onPress={() => {
              setReminderTime((prevReminderTime) => {
                const newReminderTime = [] as number[];
                if (prevReminderTime) {
                  newReminderTime.push(...prevReminderTime);
                }
                if (newReminderTime.includes(option.value!)) {
                  newReminderTime.splice(newReminderTime.indexOf(option.value!), 1);
                } else {
                  newReminderTime.push(option.value!);
                }
                return newReminderTime.length > 0 ? newReminderTime : null;

                
              });
            }}
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
