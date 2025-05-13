import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Task, { SubTask } from 'interfaces/Task';
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
interface NewRoutineProps {
  onAbort: () => void;
  onAdd: (newTask: Partial<Task>, diasDaSemana: number[]) => void;
}

interface ReminderOption {
  value: number | null; // Em minutos
  label: string;
}



// Opções de tempo de lembrete.
let reminderOptions: ReminderOption[] = [
  { value: 60, label: '1h antes' },
  { value: 30, label: '30min antes' },
  { value: 25, label: '25min antes' },
  { value: 10, label: '10min antes' },
  { value: 5, label: '5min antes' },
];

const NewHabit: React.FC<NewRoutineProps> = ({ onAbort, onAdd }) => {
  const [horario, setHorario] = useState<Date | null>(new Date());
  const [dias, setDias] = useState<number[]>([]);
  const [importante, setImportante] = useState<boolean>(false);
  const [urgente, setUrgente] = useState<boolean>(false);
  const [titulo, setTitulo] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [prioridade, setPrioridade] = useState<number>(0);
  const [reminderTime, setReminderTime] = useState<number[] | null>(null);
  const [data, setData] = useState<Date | null>(new Date());
  const [subtasks, setSubtasks] = useState<SubTask[]>([]);
  const [newTask, setNewTask] = useState<Partial<Task> | undefined>(
    {
      titulo: '',
      descricao: '',
      data: null,
      weekday: null,
      horario: horario?.toLocaleString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      reminderTime: null,
      notificationIds: null,
      concluido: false,
      importante: false,
      urgente: false,
      prioridade: 0,
      subtasks: [],
    }
  )
  
  useEffect(() => {
    setNewTask({
      ...newTask,
      titulo: titulo,
      descricao: descricao,
      data: data,
      weekday: dias,
      horario: horario?.toLocaleString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      reminderTime: reminderTime,
      importante: importante,
      urgente: urgente,
      prioridade: prioridade,
      subtasks: subtasks,
    });
  }, [titulo, descricao, data, dias, horario, reminderTime]);

  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: data || new Date(),
        mode: 'date',
        is24Hour: true,
        onChange: (_event, selectedDate) => {
          if (selectedDate) setData(selectedDate);
        },
      });
    }
  }

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

  const formatarData = (date: Date | null) => {
    if (date) {
      return date.toLocaleDateString(['pt-BR'], {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    }
    return new Date().toLocaleDateString(['pt-BR'], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value } = e.target;
    if (type === 'text') {
      setNewTask({ ...newTask, [name]: value });
    }
  };

  const addTask = () => {
    if ( newTask && (!newTask.titulo || !newTask.horario || dias.length === 0)) {
      Alert.alert(
        'Erro',
        'Preencha todos os campos e selecione pelo menos um dia!',
      );
      return;
    }


    setTitulo('');
    setDescricao('');
    setHorario(null);
    setDias([]);
    setReminderTime(null); // Reseta o tempo de lembrete
    return newTask ? onAdd(newTask, dias) : null; // Chama a função onAdd com a nova tarefa
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
        Nova Rotina
      </Text>
      <TextInput
        placeholder="Título da Tarefa"
        value={titulo}
        onChange={(e) => handleChange}
        style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => handleChange}
        style={{ borderBottomWidth: 1, marginBottom: 10, padding: 5 }}
      />

    {/* Seletor de Data */}

      <View>
        <Text>Selecione a Data:</Text>
        <TouchableOpacity onPress={openDatePicker} style={{ padding: 10 }}>
          <Text style={{ fontSize: 16 }}>{formatarData(data)}</Text>
        </TouchableOpacity>
      </View>

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
      {/* Seletor de Dias da Semana */}
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
      {/* Para uso na matriz de Eisenhower */}
      <View style={{ marginBottom: 10 }}>
        <Text>Importante</Text>
        <TouchableOpacity
          onPress={() => setNewTask({ ...newTask, importante: !newTask?.importante })}
          style={{
            backgroundColor: newTask?.importante ? 'green' : 'gray',
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
          }}>
          <Text style={{ color: 'white' }}>
            {newTask?.importante ? 'Importante' : 'Não Importante'}
          </Text>
        </TouchableOpacity>
        <Text>Urgente</Text>
        <TouchableOpacity
          onPress={() => setNewTask({ ...newTask, urgente: !newTask?.urgente })}
          style={{
            backgroundColor: newTask?.urgente ? 'red' : 'gray',
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
          }}>
          <Text style={{ color: 'white' }}>
            {newTask?.urgente ? 'Urgente' : 'Não Urgente'}
          </Text>
        </TouchableOpacity>
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

export default NewHabit;

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
