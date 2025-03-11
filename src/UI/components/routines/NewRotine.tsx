import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Task } from 'interfaces/task';
import React, { useContext, useState } from 'react';
import {
  Alert,
  Button,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { ReloadContext } from '../../../utils/contexts/reloadContext';
import { saveTask } from '../../../utils/storage';

interface NewRoutineProps {
  onAbort: () => void;
}

const NewRoutine: React.FC<NewRoutineProps> = ({onAbort }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [horario, setHorario] = useState<Date | null>(null);
  const [dias, setDias] = useState<string[]>([]);
  const [recorrente, setRecorrente] = useState(false);
  const { triggerReload } = useContext(ReloadContext);

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
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const addTask = () => {
    if (!titulo || !horario || dias.length === 0) {
      Alert.alert(
        'Erro',
        'Preencha todos os campos e selecione pelo menos um dia!',
      );
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      titulo,
      descricao,
      recorrente,
      dias,
      horario: formatarHorario(horario), // Salva o horário formatado como string
      icon: '📝',
      completed: false,
    };

    setTitulo('');
    setDescricao('');
    setHorario(null);
    setDias([]);
    setRecorrente(false);
    saveTask(newTask);
    triggerReload();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Nova Rotina</Text>
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
        <Text
          style={{
            fontSize: 24,
          }}
        >
          Horário:
        </Text>
        <Text
          style={{
            fontSize: 32,
            margin: 10,
            fontWeight: 'bold',
            marginBottom: 5,
          }}
        >
          {formatarHorario(horario)}
        </Text>

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
              fontSize: 25,
              color: 'white',
            }}
          >
            🛠
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
                setRecorrente(dias.length > 0);
              }}
              color={dias.includes(dia) ? 'green' : 'gray'}
            />
          ))}
        </View>
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
